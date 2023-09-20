/**初始化webgl */
function initWebgl() {
    var canvas = document.createElement("canvas");
    var body = document.getElementById('body');
    body.append(canvas);
    canvas.width = 500;
    canvas.height = 500;
    return canvas.getContext('webgl2');
}
/**初始化shader
 * @param vShaderSource 顶点着色器文本
 * @param fShaderSource 片元着色器文本
 */
function initShader(gl, vShaderSource, fShaderSource) {
    var vShader = gl.createShader(gl.VERTEX_SHADER); //创建顶点着色器
    gl.shaderSource(vShader, vShaderSource); //把着色器文本放入创建的着色器
    gl.compileShader(vShader); //编译顶点着色器
    var fShader = gl.createShader(gl.FRAGMENT_SHADER); //创建片元着色器
    gl.shaderSource(fShader, fShaderSource); //把着色器文本放入创建的着色器
    gl.compileShader(fShader); //编译片元着色器
    var program = gl.createProgram(); //创建程序
    gl.attachShader(program, vShader); //添加顶点着色器
    gl.attachShader(program, fShader); //添加片元着色器
    gl.linkProgram(program); // 连接 program 中的着色器
    gl.useProgram(program); // 告诉 WebGL 用这个 program 进行渲染
    return program;
}
/**默认顶点着色器文本 */
var DefVertexShader = "\n    attribute vec4 v_position;\n\n    void main(){\n        gl_Position=v_position;\n    }\n";
/**默认片元着色器文本 */
var DefFragmentSHader = "\n    precision mediump float;\n    uniform vec4 f_color;\n    void main(){\n        gl_FragColor=f_color;\n    }\n";
/**练习1 基本webgl流程，画三角形 */
function learn1() {
    var gl = initWebgl();
    var program = initShader(gl, DefVertexShader, DefFragmentSHader);
    var color = gl.getUniformLocation(program, "f_color"); //获取着色器中的f_color变量，传入颜色值
    gl.uniform4f(color, .9, .4, .6, .6); //由于f_color是vec4 float类型，调用对应传参方法
    var position = gl.getAttribLocation(program, "v_position"); //获取着色器中顶点变量，由于每个顶点值都不一样，得用缓存存入数组后传值
    var pb = gl.createBuffer(); //创建缓冲区对象
    // 将这个顶点缓冲对象绑定到 gl.ARRAY_BUFFER
    // 后续对 gl.ARRAY_BUFFER 的操作都会映射到这个缓存
    gl.bindBuffer(gl.ARRAY_BUFFER, pb); //绑定缓冲区对象，gl.ARRAY_BUFFER：数组类型buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0,
        -.5, .5,
        .5, .5 // 因为会将数据发送到 GPU，为了省去数据解析，这里使用 Float32Array 直接传送数据
    ]), gl.STATIC_DRAW // 表示缓冲区的内容不会经常更改
    );
    gl.vertexAttribPointer(position, // 顶点属性的索引
    2, // 组成数量，必须是 1，2，3 或 4。我们只提供了 x 和 y
    gl.FLOAT, // 每个元素的数据类型
    false, // 是否归一化到特定的范围，对 FLOAT 类型数据设置无效
    0, // stride 步长 数组中一行长度，0 表示数据是紧密的没有空隙，让 OpenGL 决定具体步长
    0 // offset 字节偏移量，必须是类型的字节长度的倍数。
    );
    gl.enableVertexAttribArray(position); // 开启 attribute 变量额，使顶点着色器能够访问缓冲区数据
    gl.clearColor(.2, .3, .4, .5); // 设置清空颜色缓冲时的颜色值
    gl.clear(gl.COLOR_BUFFER_BIT); // 清空颜色缓冲区，也就是清空画布
    // 语法 gl.drawArrays(mode, first, count); mode - 指定绘制图元的方式 first - 指定从哪个点开始绘制 count - 指定绘制需要使用到多少个点
    gl.drawArrays(gl.TRIANGLES, 0, 3); //画三角形
    // gl.drawArrays(gl.POINTS,0,3)//画点
    // gl.drawArrays(gl.LINES,0,3)//每两个点画分开的线段
    // gl.drawArrays(gl.LINE_STRIP,0,3)//画连在一起的线段，头尾不相连
    gl.uniform4f(color, .3, .5, .8, .9); //由于f_color是vec4 float类型，调用对应传参方法
    gl.drawArrays(gl.LINE_LOOP, 0, 3); //画头尾相连的线段
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3)//画连续三角形
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, 3)//画第一个点和上一个点与当前点连接的三角形，通常用于画圆或扇形
}
/**练习2 平移变换 */
function learn2() {
    var gl = initWebgl();
    var program = initShader(gl, "\n    attribute vec4 v_position;\n    uniform vec3 u_move;\n    void main(){\n        //\u521B\u5EFA\u5E73\u79FB\u77E9\u9635(\u6CBFx\u8F74\u5E73\u79FB-0.4)\n        //1   0   0  -0.4\n        //0   1   0    0\n        //0   0   1    0\n        //0   0   0    1\n        // mat4 m4=mat4(1,0,0,0,  0,1,0,0, 0,0,1,0, -0.4,0,0,1);\n        // mat4 m4=mat4(1,0,0,0,  0,1,0,0, 0,0,1,0, u_move.x,u_move.y,u_move.z,1);//\u4F20\u5165x,y,z\u5E73\u79FB\u91CF\n        mat4 m4=mat4(1,0,0,0,  0,1,0,0, 0,0,1,0, u_move,1);//vec3\u7C7B\u578B\u53EF\u4EE5\u7B80\u5199\n        gl_Position=m4*v_position;\n    }\n    ", DefFragmentSHader);
    var color = gl.getUniformLocation(program, "f_color");
    gl.uniform4f(color, .5, .3, .7, .9);
    var u_move = gl.getUniformLocation(program, "u_move");
    gl.uniform3f(u_move, -0.5, -0.3, 0); //修改x ,y ,z平移
    var position = gl.getAttribLocation(program, 'v_position');
    var pb = gl.createBuffer();
    var data = new Float32Array([
        0.0, 0.0, 1.0,
        0.0, 1.0, 0.0,
        1.0, 0.0, 0.0 //三角形顶点3坐标
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, pb);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);
    gl.clearColor(.2, .3, .4, .5);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
// learn1()
learn2();
