/**初始化canvas */
function initCanvas(){
    const canvas=document.createElement('canvas')//创建canvas
    const body=document.getElementById("body")
    body.append(canvas)
    canvas.width=500
    canvas.height=500
    return canvas.getContext("2d")//返回canvas上下文
}
/**画三角形 */
function drawTriangle(ctx: CanvasRenderingContext2D){
    ctx.moveTo(200,50)//画笔移动到第一个点
    ctx.lineTo(0,300)//画线到第二个点
    ctx.lineTo(400,300)
    ctx.lineTo(200,50)
    ctx.strokeStyle="#f00"//描线颜色
    ctx.fillStyle="rgba(200,255,80,0.5)"//填充颜色
    ctx.lineWidth=10//描线宽度
    ctx.lineCap="round" //描线两端样式
    ctx.fill()//填充
    ctx.stroke()//描线
}
/**画矩形 */
function drawRect(ctx: CanvasRenderingContext2D){
    ctx.strokeStyle="#f00"
    ctx.strokeRect(200,200,100,100)//描线矩形

    ctx.fillStyle="#880"
    ctx.fillRect(50,50,100,100)//填充矩形

    ctx.clearRect(100,100,130,130)//清除矩形范围
}














function init(){
    const ctx=initCanvas()
    // drawTriangle(ctx)
    drawRect(ctx)
}
init()