<template>
  <div style="background-color: burlywood;display:flex;">
    <canvas
      id="myCanvas"
      ref="myCanvas"
      @click="findRect"
      width="1301"
      height="601"
      @mousedown="mousedown"
      @mouseup="mouseup"
      @mousemove="mousemove"
    >
    </canvas>

    <div class="dislog" v-show="dialogVisible">
      <h2>是否删除矩形框</h2>
      <button @click="del">删除</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "demo",
  data() {
    return {
      flag: false,  
      rectWidth: 0,  //矩形框的宽
      rectHeight: 0, //矩形框的高
      totalRect: [],  //画的所有的矩形坐标长度数据存储在数组中
      downX: 0,  //鼠标点击图片落下时的位置（X）
      downY: 0,   //鼠标点击图片落下时的位置（Y）
      ctx: "",   //dom节点
      canvas: null,
      rectTag: false,
      delIndex: null,  //删除时选中的矩形框的index
      atime: null,  
      dialogVisible: false,  //删除的弹出框
    };
  },

  mounted() {
    this.canvas = this.$refs.myCanvas;
    this.ctx = this.canvas.getContext("2d");
    const testJson = require('../assets/302.json');
    console.log(testJson.shapes[0].points)
  },

  methods: {
    // 放下鼠标
    mousedown(e) {
      console.log("鼠标落下");
      this.atime = new Date().getTime();
      this.flag = true;
      this.downX = e.offsetX; 
      this.downY = e.offsetY; 
      this.mousemove(e);
    },
    // 移动鼠标
    mousemove(e) {
      if (this.flag) {
        if(this.downX - e.offsetX > 0 || this.downY - e.offsetY > 0){
          console.log("重右下往左上画");
          return
        }else{
          console.log("重左上往右下画");
          this.rectWidth = Math.abs(this.downX - e.offsetX)
          this.rectHeight = Math.abs(this.downY - e.offsetY)
          console.log("this.rectWidth", this.rectWidth);
          console.log("this.rectHeight", this.rectHeight);
          if (this.rectWidth < 10 || this.rectHeight < 10) {
            console.log("只是点击");
            this.rectWidth = 0;
            this.rectHeight = 0;
            return;
          }
          this.clear();  
          this.redrawAll();  
          this.drawRect(
            this.downX,
            this.downY,
            this.rectWidth,
            this.rectHeight
          );
        }
      }
    },
    mouseup(e) {
      this.flag = false;
      let a = new Date().getTime();
      if (a - this.atime > 150) {
        this.rectTag = false;
      } else {
        this.rectTag = true;
      }
      if (this.rectWidth || this.rectHeight) {
        this.totalRect.push({
          beforex: this.downX,
          beforey: this.downY,
          rectW: this.rectWidth,
          rectH: this.rectHeight,
        });
      }
    },
    redrawAll() {
      if (this.totalRect.length > 0) {
        this.totalRect.forEach((e) => {
          this.drawRect(e.beforex, e.beforey, e.rectW, e.rectH);
        });
      }
    },
    //清除画布
    clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawRect(x, y, lineW, lineY) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#850a1e";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x, y, lineW, lineY);
    },
   //点击画布
    findRect(e) {
      if (this.rectTag) {
        console.log("eeeeeeeeeee", e);
        console.log("this.totalRect", this.totalRect);
        this.totalRect.map((item, index) => {
          if (
            e.offsetX - item.beforex > item.rectW ||
            e.offsetX < item.beforex ||
            e.offsetY - item.beforey > item.rectH ||
            e.offsetY < item.beforey
          ) {
            return;
          } else {
            this.delIndex = index;
            this.dialogVisible = true;
            console.log("this.delIndex", this.delIndex);
          }
        });
      }
    },
    del() {
      this.dialogVisible = false;
      this.ctx.clearRect(
        this.totalRect[this.delIndex].beforex - 2,
        this.totalRect[this.delIndex].beforey - 2,
        this.totalRect[this.delIndex].rectW + 4,
        this.totalRect[this.delIndex].rectH + 4
      );
      this.totalRect.splice(this.delIndex, 1);
      this.redrawAll();
      console.log(this.totalRect, "删除了没");
    },
  },
};
</script>

<style scoped>
#myCanvas {
  background-color: blue;
  background-image: url("../assets/302.png");
}
.dislog {
  width: 200px;
  height: 200px;
  background-color: yellow;
}
</style>