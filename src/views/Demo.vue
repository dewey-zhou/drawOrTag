<template>
  <div >
    <canvas
      id="myCanvas"
      ref="myCanvas"
      width="1301"
      height="601"
    >
    </canvas>
  </div>
</template>

<script>
export default {
  name: "demo",
  data() {
    return {
      ctx: "",   //dom节点
      canvas: null,
      points:[],
      current:{x: 0, y: 0, width: 1301/2, height: 601/2},
      scale:1,
      img:require("../assets/302.png")
    };
  },
  async mounted() {
    this.canvas = this.$refs.myCanvas
    this.ctx = this.canvas.getContext("2d")
    //添加画布图片
    const img = await this.loadImage(this.img)
    this.ctx.drawImage(img, 0, 0, img.width, img.height)
    this.getPointsData()
    // this.initCanvas()
    // this.zoomaa()

  },
  methods: {
    //拿到标注的数据
    getPointsData(){
      const testJson = require('../assets/302.json');
      testJson.shapes[0].points.forEach((item)=>{
        this.points.push({x:item[0],y:item[1]})
      })
    },

    initCanvas(){
      this.$nextTick(() => {
        //画线
        let ctx = this.ctx
        ctx.beginPath();
        this.points.forEach((item) => {
          ctx.lineTo(item.x, item.y);
        });
        ctx.closePath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.closePath();
        ctx.stroke();
      });
    },
    loadImage(src) {
      return new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", () => resolve(null));
      });
    },
    async zoomaa() {
      const cvs = document.getElementById("myCanvas");
      const ctx = cvs.getContext("2d");
      const img = await this.loadImage(this.img);
      if (!img) return;
      const WIDTH = cvs.width = img.width / 2;
      const HEIGHT = cvs.height = img.height / 2;

      const current = {x: 0, y: 0, width: WIDTH, height: HEIGHT};
      let scale = 1;
      const limit = (min, max) => val => Math.min(Math.max(val, min), max);
      function zoom(position, direction) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        const origin = {
          x: position.x - current.x,
          y: position.y - current.y
        };

        scale += (direction * 0.01);

        const newWidth = WIDTH * scale;
        const newHeight = HEIGHT * scale;

        const dx = current.x + (origin.x - (origin.x / current.width * newWidth));
        const dy = current.y + (origin.y - (origin.y / current.height * newHeight));

        current.x = dx;
        current.y = dy;
        current.width = newWidth;
        current.height = newHeight;
        ctx.drawImage(img, dx, dy, newWidth, newHeight);
      }
      zoom({x: 0, y: 0}, 1);
      cvs.addEventListener("mousewheel", e => {
        e.preventDefault();
        const direction = limit(-1, 1)(e.deltaY || e.detail);
        const position = {x: e.clientX, y: e.clientY};
        zoom(position, direction);
      });

      document.getElementById("reset").addEventListener("click", function () {
        scale = 1;
        current.x = 0;
        current.y = 0;
        current.width = WIDTH;
        current.height = HEIGHT;
        zoom({x: 0, y: 0}, 1);
      });
    },
  }
}
</script>

<style scoped>
#myCanvas {
  background-color: blue;

}

</style>