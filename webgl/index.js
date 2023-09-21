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
/**练习3 立方体旋转和顶点索引绘制 */
function learn3() {
    var gl = initWebgl();
    var program = initShader(gl, "\n    attribute vec4 v_position;\n    void main(){\n        //\u8BBE\u7F6E\u51E0\u4F55\u4F53\u8F74\u65CB\u8F6C\u89D2\u5EA6\u4E3A30\u5EA6\uFF0C\u5E76\u628A\u89D2\u5EA6\u503C\u8F6C\u5316\u4E3A\u5F27\u5EA6\u503C\n        float radian = radians(30.0);\n        //\u6C42\u89E3\u65CB\u8F6C\u89D2\u5EA6\u4F59\u5F26\u503C\n        float cos = cos(radian);\n        //\u6C42\u89E3\u65CB\u8F6C\u89D2\u5EA6\u6B63\u5F26\u503C\n        float sin = sin(radian);\n        mat4 m4x=mat4(1,0,0,0,  0,cos,-sin,0, 0,sin,cos,0, 0,0,0,1);\n        mat4 m4y=mat4(cos,0,sin,0,  0,1,0,0, -sin,0,cos,0, 0,0,0,1);\n        mat4 m4z=mat4(cos,-sin,0,0,  sin,cos,0,0, 0,0,0,0, 0,0,0,1);\n        gl_Position=m4z*m4x*m4y*v_position;\n        // gl_Position=m4z*v_position;\n    }\n    ", DefFragmentSHader);
    var color = gl.getUniformLocation(program, "f_color");
    gl.uniform4f(color, .5, .3, .7, .9);
    var position = gl.getAttribLocation(program, 'v_position');
    var pb = gl.createBuffer();
    var data = new Float32Array([
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5, //顶点7
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, pb);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);
    //创建顶点索引数组
    var indexes = new Uint8Array([
        //前四个点对应索引值
        0, 1, 2, 3,
        //后四个顶点对应索引值
        4, 5, 6, 7,
        //前后对应点对应索引值  
        0, 4,
        1, 5,
        2, 6,
        3, 7 //两个点绘制一条直线
    ]);
    var ipb = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ipb);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexes, gl.STATIC_DRAW);
    gl.clearColor(.2, .3, .4, .5);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_BYTE, 0); //LINE_LOOP模式绘制前四个点
    gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_BYTE, 4); //LINE_LOOP模式从第五个点开始绘制四个点
    gl.drawElements(gl.LINES, 8, gl.UNSIGNED_BYTE, 8); //LINES模式绘制后8个点
    //  //创建顶点索引数组
    //  const indexes = new Uint8Array([
    //     0,1,2, 0,2,3,//正面
    //     4,5,6, 4,6,7,//背面
    //     0,3,4, 3,4,7,//右面
    //     0,1,4, 1,4,5,//上面
    //     1,2,5, 2,5,6,//左面
    //     2,3,6, 3,6,7,//下面
    //  ])
    //  const ipb=gl.createBuffer()
    //  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ipb)
    //  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexes,gl.STATIC_DRAW)
    //  gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_BYTE,0)
}
/**练习4 立方体上不同颜色并旋转 */
function learn4() {
    var gl = initWebgl();
    var program = initShader(gl, "\n    attribute vec4 v_position;\n    attribute vec3 a_color;\n    uniform vec3 u_angle;\n    varying vec3 v_color;\n    mat4 getMat(float angle,int mode){\n        //\u8BBE\u7F6E\u51E0\u4F55\u4F53\u8F74\u65CB\u8F6C\u89D2\u5EA6\u4E3A30\u5EA6\uFF0C\u5E76\u628A\u89D2\u5EA6\u503C\u8F6C\u5316\u4E3A\u5F27\u5EA6\u503C\n        float radian = radians(angle);\n        //\u6C42\u89E3\u65CB\u8F6C\u89D2\u5EA6\u4F59\u5F26\u503C\n        float cos = cos(radian);\n        //\u6C42\u89E3\u65CB\u8F6C\u89D2\u5EA6\u6B63\u5F26\u503C\n        float sin = sin(radian);\n        if(mode==0)return mat4(1,0,0,0,  0,cos,-sin,0, 0,sin,cos,0, 0,0,0,1);\n        if(mode==1)return mat4(cos,0,sin,0,  0,1,0,0, -sin,0,cos,0, 0,0,0,1);\n        if(mode==2)return mat4(cos,-sin,0,0,  sin,cos,0,0, 0,0,0,0, 0,0,0,1);\n    }\n    void main(){\n        mat4 m4x=getMat(u_angle.x,0);\n        mat4 m4y=getMat(u_angle.y,1);\n        gl_Position=m4x*m4y*v_position;\n        v_color=a_color;\n    }\n   \n    ", "\n    precision mediump float;\n    varying vec3 v_color;\n    void main(){\n        gl_FragColor=vec4(v_color,1.) ;\n    }\n");
    /**
     创建顶点位置数据数组data,Javascript中小数点前面的0可以省略
     **/
    var data = new Float32Array([
        .5, .5, .5, -.5, .5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, -.5, .5,
        .5, .5, .5, .5, -.5, .5, .5, -.5, -.5, .5, .5, .5, .5, -.5, -.5, .5, .5, -.5,
        .5, .5, .5, .5, .5, -.5, -.5, .5, -.5, .5, .5, .5, -.5, .5, -.5, -.5, .5, .5,
        -.5, .5, .5, -.5, .5, -.5, -.5, -.5, -.5, -.5, .5, .5, -.5, -.5, -.5, -.5, -.5, .5,
        -.5, -.5, -.5, .5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, .5,
        .5, -.5, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5 //面6
    ]);
    /**
     创建顶点颜色数组colorData
     **/
    var colorData = new Float32Array([
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 //白色——面6
    ]);
    var position = gl.getAttribLocation(program, 'v_position');
    var pb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pb);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);
    var color = gl.getAttribLocation(program, "a_color");
    var cpb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cpb);
    gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STREAM_DRAW);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(color);
    gl.enable(gl.DEPTH_TEST);
    var t = function () {
        var all = 10 * 1000;
        var angleY = (Date.now() % all) / all * 360;
        var angle = gl.getUniformLocation(program, "u_angle");
        gl.uniform3f(angle, angleY / 10, angleY, 0);
        gl.clearColor(.2, .3, .4, .5);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        window.requestAnimationFrame(function () { t(); });
    };
    t();
}
// learn1()
// learn2()
// learn3()
learn4();
