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
/**画正方形 */
function drawRect(){
    
}














function init(){
    const ctx=initCanvas()
    drawTriangle(ctx)
}
init()