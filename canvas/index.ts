/**初始化canvas */
function initCanvas() {
    const canvas = document.createElement('canvas')//创建canvas
    const body = document.getElementById("body")
    body.append(canvas)
    canvas.width = 500
    canvas.height = 500
    return canvas.getContext("2d")//返回canvas上下文
}
/**画三角形 */
function drawTriangle(ctx: CanvasRenderingContext2D) {
    ctx.moveTo(200, 50)//画笔移动到第一个点
    ctx.lineTo(0, 300)//画线到第二个点
    ctx.lineTo(400, 300)
    ctx.closePath()//最后一个点画到第一个点上
    ctx.strokeStyle = "#f00"//描线颜色
    ctx.fillStyle = "rgba(200,255,80,0.5)"//填充颜色
    ctx.lineWidth = 10//描线宽度
    ctx.lineCap = "round" //描线两端样式
    ctx.fill()//填充
    ctx.stroke()//描线
}
/**画矩形 */
function drawRect(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#f00"
    ctx.strokeRect(200, 200, 100, 100)//描线矩形

    ctx.fillStyle = "#880"
    ctx.fillRect(50, 50, 100, 100)//填充矩形

    ctx.clearRect(100, 100, 130, 130)//清除矩形范围
}

/**画圆 */
function drawCircular(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()//重新开始绘画，防止上一个点连接到这个圆上
    ctx.strokeStyle = "#f00"
    ctx.fillStyle = "#880"

    ctx.arc(60, 60, 50, 0, Math.PI * 2, false)
    ctx.stroke()
    ctx.beginPath()//重新开始画线，防止上一个点连接到这个圆上
    ctx.arc(160, 160, 80, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.stroke()
}


/**画椭圆 */
function drawEllipse(ctx: CanvasRenderingContext2D) {
    ctx.ellipse(100, 100, 50, 80, 0, 0, Math.PI * 2, false)
    ctx.stroke()
    ctx.beginPath()//重新开始画线，防止上一个点连接到这个圆上

    ctx.ellipse(300, 100, 80, 50, Math.PI / 2, 0, Math.PI * 2, false)//旋转90度
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(200, 300, 100, 50, 0, 0, Math.PI * 2, false)
    ctx.fill()
}
/**画贝塞斯曲线 */
function drawBezier(ctx: CanvasRenderingContext2D) {
    ctx.moveTo(50, 50)
    ctx.quadraticCurveTo(100, 100, 300, 50)//二次贝塞斯曲线
    // ctx.stroke()

    ctx.moveTo(50, 200)
    ctx.bezierCurveTo(100, 100, 200, 300, 300, 200)//三次贝塞斯曲线
    ctx.stroke()

}
/**画圆角矩形 */
function drawArcRect(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'blue';
    // 起始点
    ctx.moveTo(50, 150);
    // 左上角
    ctx.arcTo(50, 100, 100, 100, 50);
    // 右上角
    ctx.arcTo(250, 100, 250, 150, 50);
    // 右下角
    ctx.arcTo(250, 300, 200, 300, 50);
    // 左下角
    ctx.arcTo(50, 300, 50, 250, 50);

    ctx.closePath();
    ctx.stroke();
}

/**画太阳系 */
function drawSun(ctx: CanvasRenderingContext2D) {
    var sun = new Image();
    var moon = new Image();
    var earth = new Image();
    sun.src = 'https://img.lovepik.com/element/40097/4339.png_300.png';
    moon.src = 'https://www.freepnglogos.com/uploads/moon-png/moon-png-annual-celestial-overview-simone-matthews-18.png';
    earth.src = 'https://www.freepnglogos.com/uploads/moon-png/moon-png-annual-celestial-overview-simone-matthews-18.png';
   
    const w=500;
    var draw = () => {
        ctx.clearRect(0,0,w,w)
        //画太阳
        ctx.drawImage(sun,0,0,w,w)
        //画轨道
        ctx.beginPath()
        ctx.strokeStyle="rgba(0,255,0,0.5)"
        ctx.arc(w/2,w/2,200,0,Math.PI*2)
        ctx.stroke()

        //画地球
        const allTime=10*1000//转一周时间
        const time=(Date.now()%allTime)/allTime
        const angle=time*Math.PI*2
        const ew=40;
        ctx.save()  
        ctx.translate(w/2,w/2)
        ctx.rotate(angle)
        ctx.translate(200,0)       
        ctx.drawImage(earth,-ew/2,-ew/2,ew,ew)
        
        ctx.save()
        //画月球
        const mw=20;
        ctx.rotate(angle*2)
        ctx.translate(50,0)
        ctx.drawImage(moon,-mw/2,-mw/2,mw,mw)

        ctx.restore()
        ctx.restore()
        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
}
/**练习transform */
function transformLearn(ctx: CanvasRenderingContext2D){
    ctx.font='italic 20px 宋体'
    ctx.save()
    ctx.transform(1,0,0,1,0,0)//默认不移动，不缩放不旋转
    ctx.fillRect(0,0,50,50)
    ctx.fillStyle="#fff"
    ctx.fillText("默认",0,30)
    ctx.restore()

    ctx.save()
    ctx.transform(1,0,0,1,50,50)//平移，只改最后两个参数
    ctx.fillStyle="#f00"
    ctx.fillRect(0,0,50,50)
    ctx.fillText("平移",0,0)
    ctx.restore()

    const angle=Math.PI/6
    const sin=Math.sin(angle)
    const cos=Math.cos(angle)
    ctx.save()
    ctx.transform(cos,sin,-sin,cos,120,0)//旋转，改前面四个参数
    ctx.fillStyle="#0f0"
    ctx.fillRect(0,0,50,50)
    ctx.fillText("旋转",0,0)
    ctx.restore()

    ctx.save()
    ctx.transform(cos*2,sin*2,-sin*0.8,cos*0.8,200,0)//旋转加缩放，改前面四个参数，前两个参数乘以宽倍数，后两个乘以高倍数
    ctx.fillStyle="#00f"
    ctx.fillRect(0,0,50,50)
    ctx.fillText("旋转加缩放",0,0)
    ctx.restore()

    const xq=Math.sin(Math.PI/180*20)
    ctx.save()
    ctx.transform(1,xq,0,1,0,130)//斜切，右下
    ctx.fillStyle="#880"
    ctx.fillRect(0,0,50,50)
    ctx.fillText("斜切1",0,0)
    ctx.restore()

    ctx.save()
    ctx.transform(1,-xq,0,1,60,130)//斜切，右上
    ctx.fillStyle="#444"
    ctx.fillRect(0,0,50,50)
    ctx.fillText("斜切2",0,0)
    ctx.restore()

    ctx.save()
    ctx.transform(1,0,xq,1,130,100)//斜切
    ctx.fillStyle="#044"
    ctx.fillRect(0,0,50,50)
    ctx.fillText("斜切3",0,0)
    ctx.restore()

    ctx.save()
    ctx.transform(1,0,-xq,1,250,100)//斜切
    ctx.fillStyle="#440"
    ctx.fillRect(0,0,50,50)
    ctx.fillText("斜切4",0,0)
    ctx.restore()

    ctx.save()
    ctx.transform(1,xq,0.1,1,50,200)//斜切
    ctx.fillStyle="#c4c"
    ctx.fillRect(0,0,50,200)
    ctx.fillText("斜切5",0,0)
    ctx.restore()
}





function init() {
    const ctx = initCanvas()
    // drawTriangle(ctx)
    // drawRect(ctx)
    // drawCircular(ctx)
    // drawEllipse(ctx)
    // drawBezier(ctx)
    // drawArcRect(ctx)
    // drawSun(ctx)
    transformLearn(ctx)
}
init()