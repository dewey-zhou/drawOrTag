<template>
<div>
    <div id="content" >
        <!-- v-drag -->
        <div id="imgContent"   @mousewheel="rollImg()"  @mousedown="dragDiv" >
            <img id="bigImg" :src="img" />
            <canvas id="canvas" ref="markCanvasRef"></canvas>
        </div>
    </div>
        <button type="primary"   style="margin: 20px;" @click="saveData">保存数据</button>

</div>  
</template>
<script>
import {draw} from "@/utils/draw";
import {drawLine} from "@/utils/drawLine";

import '@/utils/drag'
export default {
  name: "demo",
  data() {
    return {
        markList:[],// 标记内容数组
        colorList:["#CDE213", "#E2137B", "#CBB8F9", "#13E2AA", "#A513E2", "#005BFF", "#12BB06", "#E28113", "#004197", "#00FF33","#5A0095", "#13B8E2", "#E1A500", "#E30000", "#DBEE7B", "#F8A8B2", "#000000", "#0B5500", "#64FFFA", "#5394F6"],
        colorDir:{},
        img:require("../assets/302.png"),
        isDrop:false,
        keyN:false
    }
  },
  async mounted() {
    const testJson = require('../assets/302.json');
    this.markList = testJson.shapes
    let that = this
    document.onkeydown = function (k) {
        let _key = window.event.keyCode
        if(_key ==78){//N
            that.keyN =!that.keyN
        }
        console.log(_key,'_key',that.keyN)
    }
    this.initCanvas(); // 画布初始化
    
  },
  methods: {
    //拿到标注的数据
    getPointsData(arrList){
      const list =[]
      arrList.forEach((item)=>{
        list.push({x:item[0],y:item[1]})
      })
      return list
    },
    //绘制多边形
    drawLine(ctx,data){
        this.$nextTick(() => {
            //画线
            ctx.beginPath();
            this.getPointsData(data.points).forEach((item) => {
            ctx.lineTo(item.x, item.y);
            });
            ctx.closePath();
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            console.log(data.label,'~~~',this.colorDir[data.points.label],this.colorDir)
            ctx.strokeStyle = this.colorDir[data.label];
            ctx.lineWidth = 3;
            ctx.closePath();
            ctx.stroke();
        });
    },
    drawRectangle(ctx,data){
        this.$nextTick(()=>{
            //画矩形
            ctx.strokeStyle = this.colorDir[data.label]// 画笔颜色
            ctx.lineWidth = 3 // 画笔粗细
            ctx.save()
            ctx.beginPath()
            //等待数据
            ctx.rect(data.x, data.y, data.w, data.h);
            ctx.stroke()
        })
    },
    // 绘制点
    drawerPoint (ctx, data) {
        this.getPointsData(data.points).forEach((item)=>{
            ctx.save()
            ctx.fillStyle =this.colorDir[data.label]
            ctx.strokeStyle = this.colorDir[data.label]// 画笔颜色
            ctx.beginPath()
            ctx.arc(item.x, item.y, 6, 0, Math.PI * 2, true) 
            ctx.closePath()
            ctx.fill()
            ctx.restore() 
        })
        
    },
    initCanvas(){//画布初始化
        setTimeout(()=>{
            this.$nextTick(() => {
                // 初始化canvas宽高
                let cav = this.$refs.markCanvasRef;
                console.log(document.getElementById('imgContent').clientHeight);
                cav.width = document.getElementById('imgContent').offsetWidth;
                cav.height = document.getElementById('imgContent').offsetHeight;
                console.log(cav);
                let ctx = cav.getContext('2d');
                ctx.strokeStyle = 'blue';
                cav.style.cursor = !this.keyN?'pointer':'crosshair';
                let i =0
                const rectList=[]
                const lineList =[]
                this.markList.forEach((item)=>{
                    if(!this.colorDir.hasOwnProperty(item.label)){
                        this.colorDir[item.label] = this.colorList[i++]
                    }
                    if(item.shape_type =="rect"){
                        this.drawRectangle(ctx,item)
                        rectList.push(item)
                    }else{
                        // this.drawLine(ctx,item)
                        // lineList.push(item)
                    }
                })
                // 调用封装的绘制方法
                this.markList = draw(cav, rectList)
                // this.markList =drawLine(cav,lineList)
            })
        },200)
    },
    //滚轮缩放
    rollImg(){
        /* 获取当前页面的缩放比
           若未设置zoom缩放比，则为默认100%，即1，原图大小
       */
        console.log(document.getElementById('bigImg').style.zoom);
        var zoom = parseInt(document.getElementById('bigImg').style.zoom) || 100;
        /* event.wheelDelta 获取滚轮滚动值并将滚动值叠加给缩放比zoom    wheelDelta统一为±120，其中正数表示为向上滚动，负数表示向下滚动  */
        zoom += event.wheelDelta / 12;
        document.getElementById('bigImg').style.zoom = zoom + "%";
        /* 最小范围 和 最大范围 的图片缩放尺度 */
        // if (zoom >= 100 && zoom <250) {
        //     document.getElementById('bigImg').style.zoom = zoom + "%";
        // }
        return false;
    },
    saveData(){
        console.log("数据",this.markList);
    },
    dragDiv(e){
        if(this.keyN)return
        var el = document.getElementById('imgContent')
        var disx = e.pageX - el.offsetLeft
        var disy = e.pageY - el.offsetTop
        document.onmousemove = function(e) {
            el.style.left = e.pageX - disx + 'px'
            el.style.top = e.pageY - disy + 'px'
        }
        document.onmouseup = function() {
            document.onmousemove = document.onmouseup = null
        }
    }
  } 
}   
</script>
<style lang="scss" scoped>
#content {
    width:1301px;
    height: 601px;
    overflow: hidden;
    border: 1px solid red;

    #imgContent{
        display: inline-block;
        position: relative;
        margin: 0 auto;
        height: auto;
        width: auto;
        user-select:none;
    }
    canvas {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
    }
}
</style>
