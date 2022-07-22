/**
 * 画布中绘制多边形
 * 参数: cav-画布对象  list-多边形数组 i-选中多边形下标
 **/

 const colorList=["#CDE213", "#E2137B", "#CBB8F9", "#13E2AA", "#A513E2", "#005BFF", "#12BB06", "#E28113", "#004197", "#00FF33","#5A0095", "#13B8E2", "#E1A500", "#E30000", "#DBEE7B", "#F8A8B2", "#000000", "#0B5500", "#64FFFA", "#5394F6"]
 const colorDir={}
 let start = false
 let selectPoint =-1
 let iem = []; //鼠标点击时临时存储所在多边形下标以及该多边形第几个点
 let keyN =false

/* 操作执行方法分发 */
export function drawLine(cav, list, i) {
    // 画布初始化
    let ctx = cav.getContext('2d');
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    
    // 变量初始化
    let sX = 0; // 鼠标X坐标
    let sY = 0; // 鼠标Y坐标
    document.onkeyup = function (k) {
        let _key = window.event.keyCode
        console.log(_key,'_key')
        // if(_key ==13){//回车
        //     start=false
        //     selectPoint=-1
        //     iem = []
        //     reDraw(cav, ctx, list)
        // }
        if(_key ==78){//N
            keyN=!keyN
            if(!keyN){
                start=false
                selectPoint=-1
                iem = []
                reDraw(cav, ctx, list,'pointer')
            }
        }
    }
    cav.onmousedown= function(em){
        cav.onmouseup=()=>{}
        if(!keyN)return

        sX = em.offsetX
        sY = em.offsetY
        console.log('start:',start,"selectPoint:",selectPoint,"iem:",iem)
        if(list.length ==0){//无多边形
            newDraw(cav,ctx,list,[sX,sY])
        }else if(start){//在画中
            Drawing(cav,ctx,list,sX,sY)
        }
        else{
            console.log('selectpoint:',selectPoint)
            if(selectPoint!=-1){
                
                moveDrawPoint(cav,ctx,sX,sY,list[selectPoint],selectPoint,list)
                return
            }else{
                selectPoint=-1
            }
            let n =0
            for (let i = 0; i < list.length; i++) {//多个多边形
                if(!colorDir.hasOwnProperty(list[i].label)){
                    colorDir[list[i].label] = colorList.shift()
                }
                if(checkPointInLine([sX,sY],list[i].points)){
                    console.log('在里面',i)
                    drawerPoint(cav,ctx,list[i])
                    selectPoint = i
                }else{
                    n++
                }
            }
            //点击未在多边形内
            if(n==list.length){
                selectPoint=-1
                console.log('点击未在多边形内')
               
                newDraw(cav,ctx,list,[sX,sY])
            }
        }
       
    }
    return list;
}
function Drawing(cav,ctx,list,sX,sY){
    list[list.length-1].points.push([sX,sY])
    console.log(list[list.length-1].points)
    cav.onmousemove = function (em1){
        if(start){
            list[list.length-1].points[list[list.length-1].points.length-1]=[em1.offsetX,em1.offsetY]
            reDraw(cav,ctx,list,'crosshair')
        }
    }
    cav.onmouseup = function () {
        if(start){
            console.log(list[list.length-1].points)
            reDraw(cav,ctx,list,'crosshair')
        } 
    };
}

function newDraw(cav,ctx,list,point){
    start =true
    const l =(new Date()).getTime()
    list.push({
        label: l,
        points: [point],
        group_id: null,
        shape_type: "polygon",
        flags: {}
    }) 
    colorDir[list[list.length-1].label] = colorList.shift()
    Drawing(cav,ctx,list,point[0],point[1])
}

function moveDrawPoint(cav,ctx,sX,sY,value,i,list){
    let n = 0
    for (let j = 0; j < value.points.length; j++) {
        const item = value.points[j]
        let pX = item[0]
        let pY = item[1]
        if(Math.abs(pX- sX) < 10 && Math.abs(pY - sY) < 10){//代表选中当前点
             iem = [i,j]
            console.log(iem,'选中的点')
            cav.style.cursor='all-scroll'
            cav.onmousemove = function (em1){
                console.log('移动2',iem)
                list[iem[0]].points[iem[1]]=[em1.offsetX,em1.offsetY]
                reDraw(cav,ctx,list,'all-scroll')   
            }
            cav.onmouseup = function () {
                // 重绘矩形
                reDraw(cav, ctx, list,'all-scroll');
                drawerPoint(cav,ctx,list[i])
                iem[1]=null
                cav.onmousemove=()=>{}
            };
            break
        }else{
            n++
        }
    }
    console.log(n,value.points.length)
    if(n==value.points.length){
        //点击在多边形外
        selectPoint=-1
        console.log('chus')
        reDraw(cav, ctx, list,'crosshair')
    }
}

function getPointsData(arrList){
    const list =[]
    arrList.forEach((item)=>{
      list.push({x:item[0],y:item[1]})
    })
    return list
}
// 判断点是否在多边形内  
function checkPointInLine(p,pointList){
    let point = {x:p[0],y:p[1]}
    let polygon = getPointsData(pointList)
    var p1, p2, p3, p4;

    p1 = point;
    p2 = { x: 1000000000000, y: point.y };

    var count = 0;
    //对每条边都和射线作对比
    for (var i = 0; i < polygon.length - 1; i++) {
        p3 = polygon[i];

        p4 = polygon[i + 1];
        if (checkCross(p1, p2, p3, p4) == true) {
            count++;
        }
    }
    p3 = polygon[polygon.length - 1];

    p4 = polygon[0];
    if (checkCross(p1, p2, p3, p4) == true) {
        count++;
    }
    return (count % 2 == 0) ? false : true;

    //判断两条线段是否相交
    function checkCross(p1, p2, p3, p4) {
        var v1 = { x: p1.x - p3.x, y: p1.y - p3.y },
        v2 = { x: p2.x - p3.x, y: p2.y - p3.y },

        v3 = { x: p4.x - p3.x, y: p4.y - p3.y },
        v = crossMul(v1, v3) * crossMul(v2, v3);

        v1 = { x: p3.x - p1.x, y: p3.y - p1.y };
        v2 = { x: p4.x - p1.x, y: p4.y - p1.y };

        v3 = { x: p2.x - p1.x, y: p2.y - p1.y };
        return (v <= 0 && crossMul(v1, v3) * crossMul(v2, v3) <= 0) ? true : false;

    }

    //计算向量叉乘
    function crossMul(v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    }
}

 // 绘制点
 function drawerPoint (cav,ctx, data) {
    console.log(data)
    getPointsData(data.points).forEach((item)=>{
        ctx.save()
        console.log(colorDir[data.label])
        cav.style.cursor = 'crosshair'
        ctx.fillStyle =colorDir[data.label]
        ctx.strokeStyle = colorDir[data.label]// 画笔颜色
        ctx.beginPath()
        ctx.arc(item.x, item.y, 6, 0, Math.PI * 2, true) 
        ctx.closePath()
        ctx.fill()
        ctx.restore() 
    })
    
}
//绘制多边形
function drawPg(cav,ctx,data,cursorStyle){
    //画线
    console.log(cursorStyle,'zd')
    cav.style.cursor = cursorStyle
    ctx.beginPath();
    getPointsData(data.points).forEach((item) => {
    ctx.lineTo(item.x, item.y);
    });
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = colorDir[data.label];
    ctx.lineWidth = 3;
    ctx.closePath();
    ctx.stroke();
}

/* 重绘所有多边形 */
function reDraw(cav, ctx, list,cursorStyle) {
    cav.style.cursor=cursorStyle

    ctx.clearRect(0, 0, cav.width, cav.height);
    list.forEach(function (value) {
        drawPg(cav,ctx,value,cursorStyle)
        // ctx.save()
        // ctx.strokeStyle = 'red'// 画笔颜色
        // console.log(colorDir[value.label])
        // ctx.beginPath()
        // getPointsData(value.points).forEach((item)=>{
        //     // ctx.arc(item.x,item.y, 6, 0, Math.PI * 2, true)
        //     ctx.lineTo(item.x, item.y);
        // })
        // ctx.closePath()
        // ctx.fill()
        // ctx.restore() 
    });
}

