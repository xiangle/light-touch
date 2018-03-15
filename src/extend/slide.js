export default function (options = {}) {

   let { el } = this;

   let { clientWidth, children, firstElementChild, lastElementChild } = el;

   this.clientWidth = clientWidth;

   if (children.length) {

      Object.assign(this, {
         gap: 5,
         loop: false,
         distance: 5,
         autoPlay: 3000,
         damping: 5,
         position: 1,
      }, options);

      el.style.transitionProperty = `transform`;
      el.style.transform = `translateX(0px)`;

      // 循环模式时创建重叠闭环节点
      if (this.loop) {

         this.current = this.position;

         // 首尾添加交叉重叠元素
         el.appendChild(firstElementChild.cloneNode(true));
         el.insertBefore(lastElementChild.cloneNode(true), el.children[0]);
         el.style.transform = `translateX(${-clientWidth}px)`;

         // 在过渡结束后，对重合元素进行换向操作
         el.addEventListener("transitionend", () => {
            if (this.current === 0) {
               this.current = this.amount - 1;
               let X = this.clientWidth * this.current;
               el.style.transform = `translateX(${-X}px)`;
               el.style.transitionDuration = "0ms";
            } else if (this.current === this.amount) {
               this.current = 1;
               el.style.transform = `translateX(${-this.clientWidth}px)`;
               el.style.transitionDuration = "0ms";
            }
         }, false);

      } else {
         this.current = 0;
         el.style.transform = `translateX(0px)`;
      }

      this.amount = children.length - 1;

      // 使用绝对定位，子节点相对父节点位置始终保持固定
      for (let i = 0; i < children.length; i++) {
         let item = children[i];
         item.style.left = `${i}00%`;
      }

      let autoPlay = () => {
         if (this.autoPlay) {
            this.timeID = setTimeout(() => {
               if (this.current < this.amount) {
                  let X = ++this.current * this.clientWidth;
                  el.style.transitionDuration = "450ms";
                  el.style.transitionTimingFunction = "ease";
                  el.style.transform = `translateX(${-X}px)`;
                  autoPlay();
               }
            }, this.autoPlay);
         }
      }

      // 自动轮播
      autoPlay();

      this.on('touchstart', () => {
         this.autoPlay && clearTimeout(this.timeID);
         let { transform } = getComputedStyle(this.el, null);
         this.translateStartX = Number(transform.split(", ")[4]);
         this.el.style.transform = `translateX(${this.translateStartX}px)`;
         this.el.style.transitionDuration = "0ms";
      })

      this.on("touchmove", () => {

         // 手势匹配成功
         if (this.direction) {

            if (!this.loop) {
               // 非循环模式下，末端使用缓速滑动
               if (this.current === 0) {
                  if (this.moveX > 0) this.moveX = this.moveX / this.damping;
               } else if (this.current === this.amount) {
                  if (this.moveX < 0) this.moveX = this.moveX / this.damping;
               }
            }

            this.translateX = this.translateStartX + this.moveX;
            el.style.transform = `translateX(${this.translateX}px)`;

            // 手势识别成功后的touchmove，供开发者调用
            this.move && this.move.call(this);

         }

         // 手势匹配阶段direction为undefined，失败后为false
         else if (this.direction === undefined) {

            // 滑动方向判断，通过起点圆周判坐标比值判断
            let moveX = Math.abs(this.moveX)
            let moveY = Math.abs(this.moveY)

            // 超出滑动起始范围时锁定手势判断
            if (moveX > this.gap || moveY > this.gap) {

               if (moveY === 0) {
                  this.direction = 1
               } else {
                  let difference = moveX / moveY
                  if (difference > 5) {
                     this.direction = 1
                  }
                  // 匹配失败
                  else {
                     this.direction = false
                  }
               }

               // 初始滑动自由间隙补偿
               if (this.moveX > 0) {
                  this.startX += this.gap
               } else if (this.moveX < 0) {
                  this.startX -= this.gap
               }

            }

         }

      })

      this.on("touchend", () => {

         // 计算位移差值，使用移动端优先原则，忽略PC端touchend事件差异
         let shiftX = this.lastX[2] - this.lastX[0];
         if (shiftX > this.distance) {
            if (this.loop) {
               --this.current;
            } else {
               if (this.current > 0) {
                  --this.current;
               }
            }
         } else if (shiftX < -this.distance) {
            if (this.loop) {
               ++this.current;
            } else {
               if (this.current < this.amount) {
                  ++this.current;
               }
            }
         }

         let X = this.clientWidth * this.current;
         el.style.transform = `translateX(${-X}px)`;
         el.style.transitionDuration = "300ms";
         el.style.transitionTimingFunction = "ease-out";

         this.direction = undefined

         autoPlay();

      })

   }

   return this;

}