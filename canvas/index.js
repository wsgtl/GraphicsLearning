/**初始化canvas */
function initCanvas() {
    var canvas = document.createElement('canvas'); //创建canvas
    var body = document.getElementById("body");
    body.append(canvas);
    canvas.width = 500;
    canvas.height = 500;
    return canvas.getContext("2d"); //返回canvas上下文
}
/**画三角形 */
function drawTriangle(ctx) {
    ctx.moveTo(200, 50); //画笔移动到第一个点
    ctx.lineTo(0, 300); //画线到第二个点
    ctx.lineTo(400, 300);
    ctx.closePath(); //最后一个点画到第一个点上
    ctx.strokeStyle = "#f00"; //描线颜色
    ctx.fillStyle = "rgba(200,255,80,0.5)"; //填充颜色
    ctx.lineWidth = 10; //描线宽度
    ctx.lineCap = "round"; //描线两端样式
    ctx.fill(); //填充
    ctx.stroke(); //描线
}
/**画矩形 */
function drawRect(ctx) {
    ctx.strokeStyle = "#f00";
    ctx.strokeRect(200, 200, 100, 100); //描线矩形
    ctx.fillStyle = "#880";
    ctx.fillRect(50, 50, 100, 100); //填充矩形
    ctx.clearRect(100, 100, 130, 130); //清除矩形范围
}
/**画圆 */
function drawCircular(ctx) {
    ctx.beginPath(); //重新开始绘画，防止上一个点连接到这个圆上
    ctx.strokeStyle = "#f00";
    ctx.fillStyle = "#880";
    ctx.arc(60, 60, 50, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.beginPath(); //重新开始画线，防止上一个点连接到这个圆上
    ctx.arc(160, 160, 80, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
}
/**画椭圆 */
function drawEllipse(ctx) {
    ctx.ellipse(100, 100, 50, 80, 0, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.beginPath(); //重新开始画线，防止上一个点连接到这个圆上
    ctx.ellipse(300, 100, 80, 50, Math.PI / 2, 0, Math.PI * 2, false); //旋转90度
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(200, 300, 100, 50, 0, 0, Math.PI * 2, false);
    ctx.fill();
}
/**画贝塞斯曲线 */
function drawBezier(ctx) {
    ctx.moveTo(50, 50);
    ctx.quadraticCurveTo(100, 100, 300, 50); //二次贝塞斯曲线
    // ctx.stroke()
    ctx.moveTo(50, 200);
    ctx.bezierCurveTo(100, 100, 200, 300, 300, 200); //三次贝塞斯曲线
    ctx.stroke();
}
/**画圆角矩形 */
function drawArcRect(ctx) {
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
function init() {
    var ctx = initCanvas();
    // drawTriangle(ctx)
    // drawRect(ctx)
    // drawCircular(ctx)
    // drawEllipse(ctx)
    drawBezier(ctx);
    // drawArcRect(ctx)
}
init();
