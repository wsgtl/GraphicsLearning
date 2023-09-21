
/**初始化webgl */
function initWebgl(): WebGL2RenderingContext {
    const canvas = document.createElement("canvas")
    const body = document.getElementById('body')
    body.append(canvas)
    canvas.width = 500
    canvas.height = 500

    return canvas.getContext('webgl2')
}
/**初始化shader
 * @param vShaderSource 顶点着色器文本
 * @param fShaderSource 片元着色器文本
 */
function initShader(gl: WebGLRenderingContext, vShaderSource: string, fShaderSource: string) {
    const vShader = gl.createShader(gl.VERTEX_SHADER)//创建顶点着色器
    gl.shaderSource(vShader, vShaderSource)//把着色器文本放入创建的着色器
    gl.compileShader(vShader)//编译顶点着色器

    const fShader = gl.createShader(gl.FRAGMENT_SHADER)//创建片元着色器
    gl.shaderSource(fShader, fShaderSource)//把着色器文本放入创建的着色器
    gl.compileShader(fShader)//编译片元着色器

    const program = gl.createProgram()//创建程序
    gl.attachShader(program, vShader)//添加顶点着色器
    gl.attachShader(program, fShader)//添加片元着色器
    gl.linkProgram(program)// 连接 program 中的着色器
    gl.useProgram(program)// 告诉 WebGL 用这个 program 进行渲染
    return program

}
/**默认顶点着色器文本 */
const DefVertexShader = `
    attribute vec4 v_position;

    void main(){
        gl_Position=v_position;
    }
`
/**默认片元着色器文本 */
const DefFragmentSHader = `
    precision mediump float;
    uniform vec4 f_color;
    void main(){
        gl_FragColor=f_color;
    }
`
/**练习1 基本webgl流程，画三角形 */
function learn1() {
    const gl = initWebgl()

    const program = initShader(gl, DefVertexShader, DefFragmentSHader)

    const color = gl.getUniformLocation(program, "f_color")//获取着色器中的f_color变量，传入颜色值
    gl.uniform4f(color, .9, .4, .6, .6)//由于f_color是vec4 float类型，调用对应传参方法

    const position = gl.getAttribLocation(program, "v_position")//获取着色器中顶点变量，由于每个顶点值都不一样，得用缓存存入数组后传值
    const pb = gl.createBuffer()//创建缓冲区对象
    // 将这个顶点缓冲对象绑定到 gl.ARRAY_BUFFER
    // 后续对 gl.ARRAY_BUFFER 的操作都会映射到这个缓存
    gl.bindBuffer(gl.ARRAY_BUFFER, pb)//绑定缓冲区对象，gl.ARRAY_BUFFER：数组类型buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([//传入顶点坐标
        0, 0,
        -.5, .5,
        .5, .5// 因为会将数据发送到 GPU，为了省去数据解析，这里使用 Float32Array 直接传送数据
    ]),
        gl.STATIC_DRAW// 表示缓冲区的内容不会经常更改
    )
    gl.vertexAttribPointer(
        position, // 顶点属性的索引
        2,// 组成数量，必须是 1，2，3 或 4。我们只提供了 x 和 y
        gl.FLOAT,// 每个元素的数据类型
        false,// 是否归一化到特定的范围，对 FLOAT 类型数据设置无效
        0,// stride 步长 数组中一行长度，0 表示数据是紧密的没有空隙，让 OpenGL 决定具体步长
        0// offset 字节偏移量，必须是类型的字节长度的倍数。
    )
    gl.enableVertexAttribArray(position)// 开启 attribute 变量额，使顶点着色器能够访问缓冲区数据

    gl.clearColor(.2, .3, .4, .5)// 设置清空颜色缓冲时的颜色值
    gl.clear(gl.COLOR_BUFFER_BIT)// 清空颜色缓冲区，也就是清空画布
    // 语法 gl.drawArrays(mode, first, count); mode - 指定绘制图元的方式 first - 指定从哪个点开始绘制 count - 指定绘制需要使用到多少个点
    gl.drawArrays(gl.TRIANGLES, 0, 3)//画三角形
    // gl.drawArrays(gl.POINTS,0,3)//画点
    // gl.drawArrays(gl.LINES,0,3)//每两个点画分开的线段
    // gl.drawArrays(gl.LINE_STRIP,0,3)//画连在一起的线段，头尾不相连
    gl.uniform4f(color, .3, .5, .8, .9)//由于f_color是vec4 float类型，调用对应传参方法
    gl.drawArrays(gl.LINE_LOOP, 0, 3)//画头尾相连的线段

    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3)//画连续三角形
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, 3)//画第一个点和上一个点与当前点连接的三角形，通常用于画圆或扇形
}

/**练习2 平移变换 */
function learn2() {
    const gl = initWebgl()
    const program = initShader(gl, `
    attribute vec4 v_position;
    uniform vec3 u_move;
    void main(){
        //创建平移矩阵(沿x轴平移-0.4)
        //1   0   0  -0.4
        //0   1   0    0
        //0   0   1    0
        //0   0   0    1
        // mat4 m4=mat4(1,0,0,0,  0,1,0,0, 0,0,1,0, -0.4,0,0,1);
        // mat4 m4=mat4(1,0,0,0,  0,1,0,0, 0,0,1,0, u_move.x,u_move.y,u_move.z,1);//传入x,y,z平移量
        mat4 m4=mat4(1,0,0,0,  0,1,0,0, 0,0,1,0, u_move,1);//vec3类型可以简写
        gl_Position=m4*v_position;
    }
    `, DefFragmentSHader)
    const color = gl.getUniformLocation(program, "f_color")
    gl.uniform4f(color, .5, .3, .7, .9)
    const u_move = gl.getUniformLocation(program, "u_move")
    gl.uniform3f(u_move, -0.5, -0.3, 0)//修改x ,y ,z平移

    const position = gl.getAttribLocation(program, 'v_position')
    const pb = gl.createBuffer()
    var data = new Float32Array([
        0.0, 0.0, 1.0,//三角形顶点1坐标
        0.0, 1.0, 0.0,//三角形顶点2坐标
        1.0, 0.0, 0.0//三角形顶点3坐标
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, pb)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(position)

    gl.clearColor(.2, .3, .4, .5)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES, 0, 3)
}


/**练习3 立方体旋转和顶点索引绘制 */
function learn3() {
    const gl = initWebgl()
    const program = initShader(gl, `
    attribute vec4 v_position;
    void main(){
        //设置几何体轴旋转角度为30度，并把角度值转化为弧度值
        float radian = radians(30.0);
        //求解旋转角度余弦值
        float cos = cos(radian);
        //求解旋转角度正弦值
        float sin = sin(radian);
        mat4 m4x=mat4(1,0,0,0,  0,cos,-sin,0, 0,sin,cos,0, 0,0,0,1);
        mat4 m4y=mat4(cos,0,sin,0,  0,1,0,0, -sin,0,cos,0, 0,0,0,1);
        mat4 m4z=mat4(cos,-sin,0,0,  sin,cos,0,0, 0,0,0,0, 0,0,0,1);
        gl_Position=m4z*m4x*m4y*v_position;
        // gl_Position=m4z*v_position;
    }
    `, DefFragmentSHader)
    const color = gl.getUniformLocation(program, "f_color")
    gl.uniform4f(color, .5, .3, .7, .9)


    const position = gl.getAttribLocation(program, 'v_position')
    const pb = gl.createBuffer()
    var data = new Float32Array([
        0.5, 0.5, 0.5,//顶点0
        -0.5, 0.5, 0.5,//顶点1
        -0.5, -0.5, 0.5,//顶点2
        0.5, -0.5, 0.5,//顶点3
        0.5, 0.5, -0.5,//顶点4
        -0.5, 0.5, -0.5,//顶点5
        -0.5, -0.5, -0.5,//顶点6
        0.5, -0.5, -0.5,//顶点7
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, pb)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(position)

    //创建顶点索引数组
    const indexes = new Uint8Array([
        //前四个点对应索引值
        0, 1, 2, 3,//gl.LINE_LOOP模式四个点绘制一个矩形框
        //后四个顶点对应索引值
        4, 5, 6, 7,//gl.LINE_LOOP模式四个点绘制一个矩形框
        //前后对应点对应索引值  
        0, 4,//两个点绘制一条直线
        1, 5,//两个点绘制一条直线
        2, 6,//两个点绘制一条直线
        3, 7//两个点绘制一条直线
    ])
    const ipb=gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ipb)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexes,gl.STATIC_DRAW)
    

    gl.clearColor(.2, .3, .4, .5)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_BYTE, 0)//LINE_LOOP模式绘制前四个点
    gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_BYTE, 4)//LINE_LOOP模式从第五个点开始绘制四个点
    gl.drawElements(gl.LINES,8,gl.UNSIGNED_BYTE,8)//LINES模式绘制后8个点

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
function learn4(){
    const gl = initWebgl()
    const program = initShader(gl, `
    attribute vec4 v_position;
    attribute vec3 a_color;
    uniform vec3 u_angle;
    varying vec3 v_color;
    mat4 getMat(float angle,int mode){
        //设置几何体轴旋转角度为30度，并把角度值转化为弧度值
        float radian = radians(angle);
        //求解旋转角度余弦值
        float cos = cos(radian);
        //求解旋转角度正弦值
        float sin = sin(radian);
        if(mode==0)return mat4(1,0,0,0,  0,cos,-sin,0, 0,sin,cos,0, 0,0,0,1);
        if(mode==1)return mat4(cos,0,sin,0,  0,1,0,0, -sin,0,cos,0, 0,0,0,1);
        if(mode==2)return mat4(cos,-sin,0,0,  sin,cos,0,0, 0,0,0,0, 0,0,0,1);
    }
    void main(){
        mat4 m4x=getMat(u_angle.x,0);
        mat4 m4y=getMat(u_angle.y,1);
        mat4 m4s=mat4(1,0,0,0, 0,.8,0,0, 0,0,1,0, 0,0,0,1);
        gl_Position=m4s*m4x*m4y*v_position;
        v_color=a_color;
    }
   
    `,  `
    precision mediump float;
    varying vec3 v_color;
    void main(){
        gl_FragColor=vec4(v_color,1.) ;
    }
`)
   
/**
 创建顶点位置数据数组data,Javascript中小数点前面的0可以省略
 **/
 var data=new Float32Array([
    .5,.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,      //面1
    .5,.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,      //面2
    .5,.5,.5,.5,.5,-.5,-.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,      //面3
    -.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,//面4
    -.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,.5,//面5
    .5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,.5,-.5 //面6
]);
/**
 创建顶点颜色数组colorData
 **/
var colorData = new Float32Array([
    1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,//红色——面1
    0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0,//绿色——面2
    0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,//蓝色——面3
    1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0, 1,1,0,//黄色——面4
    0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0,//黑色——面5
    1,1,1, 1,1,1, 1,1,1, 1,1,1, 1,1,1, 1,1,1 //白色——面6
]);

    const position = gl.getAttribLocation(program, 'v_position')
    const pb = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, pb)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(position)

    

    const color = gl.getAttribLocation(program, "a_color")
    const cpb=gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER,cpb)
    gl.bufferData(gl.ARRAY_BUFFER,colorData,gl.STREAM_DRAW)
    gl.vertexAttribPointer(color,3,gl.FLOAT,false,0,0)
    gl.enableVertexAttribArray(color)

  

    gl.enable(gl.DEPTH_TEST)
    const t=()=>{
        const all=10*1000;
        const angleY=(Date.now()%all)/all*360
        const angle=gl.getUniformLocation(program,"u_angle")
        gl.uniform3f(angle,30,angleY,0)
        gl.clearColor(.2, .3, .4, .5)//每一帧都要刷新背景颜色
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLES,0,36)//每一帧都要重绘
        window.requestAnimationFrame(()=>{t()})
    }
    t();
   

   
   
   
}

/**练习5 立方体添加光源和gl_FragCoord练习*/
function learn5(){
    const gl = initWebgl()
    const program = initShader(gl, `
    attribute vec4 v_position;
    uniform vec3 u_angle;
    uniform vec4 a_color;// attribute声明顶点颜色变量
    attribute vec4 a_normal;//顶点法向量变量
    uniform vec3 u_lightColor;// uniform声明平行光颜色变量
    uniform vec3 u_lightPosition;// uniform声明平行光颜色变量
    varying vec4 v_color;//varying声明顶点颜色插值后变量

    mat4 getMat(float angle,int mode){
        //设置几何体轴旋转角度为30度，并把角度值转化为弧度值
        float radian = radians(angle);
        //求解旋转角度余弦值
        float cos = cos(radian);
        //求解旋转角度正弦值
        float sin = sin(radian);
        if(mode==0)return mat4(1,0,0,0,  0,cos,-sin,0, 0,sin,cos,0, 0,0,0,1);
        if(mode==1)return mat4(cos,0,sin,0,  0,1,0,0, -sin,0,cos,0, 0,0,0,1);
        if(mode==2)return mat4(cos,-sin,0,0,  sin,cos,0,0, 0,0,0,0, 0,0,0,1);
    }
    void main(){
        mat4 m4x=getMat(u_angle.x,0);
        mat4 m4y=getMat(u_angle.y,1);
        gl_Position=m4x*m4y*v_position;

        // 顶点法向量进行矩阵变换，然后归一化
        vec3 normal = normalize((m4x*m4y*a_normal).xyz);
        // 计算点光源照射顶点的方向并归一化
        vec3 lightDirection = normalize(vec3(gl_Position) - u_lightPosition);   
        // 计算平行光方向向量和顶点法向量的点积
        float dot=max(dot(lightDirection,normal),0.0);
        // 计算反射后的颜色
        vec3 reflectedLight = u_lightColor*a_color.rgb*dot;
        //颜色插值计算
        v_color=vec4(reflectedLight,a_color.a);
    }
   
    `,  `
    precision mediump float;
    varying vec4 v_color;
    void main(){
        if(gl_FragCoord.x < 200.0){
            // canvas画布上[0,300)之间片元像素值设置
            gl_FragColor = v_color+vec4(-.2,.8,.4,-.2);
            return;
        }
        if(gl_FragCoord.y < 200.0){
            // canvas画布上[0,300)之间片元像素值设置
            gl_FragColor = v_color+vec4(-.4,.2,.4,-.2);
            return;
        }
        gl_FragColor=v_color;
    }
`)
   
/**
 创建顶点位置数据数组data,Javascript中小数点前面的0可以省略
 **/
 var data=new Float32Array([
    .5,.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,      //面1
    .5,.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,      //面2
    .5,.5,.5,.5,.5,-.5,-.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,      //面3
    -.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,//面4
    -.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,.5,//面5
    .5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,.5,-.5 //面6
]);

    const position = gl.getAttribLocation(program, 'v_position')
    const pb = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, pb)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(position)

    /**
     *顶点法向量数组normalData
    **/
    var normalData = new Float32Array([
        0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,//z轴正方向——面1
        1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,//x轴正方向——面2
        0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,//y轴正方向——面3
        -1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,//x轴负方向——面4
        0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,//y轴负方向——面5
        0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1//z轴负方向——面6
    ]);
    const normal = gl.getAttribLocation(program, 'a_normal')
    const npb = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, npb)
    gl.bufferData(gl.ARRAY_BUFFER, normalData, gl.STATIC_DRAW)
    gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(normal)


    const color = gl.getUniformLocation(program, "a_color")
    gl.uniform4f(color,1,0,0,1)
  
    var u_lightColor = gl.getUniformLocation(program,'u_lightColor');
    var u_lightPosition = gl.getUniformLocation(program,'u_lightPosition');
    /**
     * 给平行光传入颜色和方向数据，RGB(1,1,1),单位向量(x,y,z)
     **/
    gl.uniform3f(u_lightColor, 1.0, 1.0, 1.0);
    //保证向量(x,y,-z)的长度为1，即单位向量
    // 如果不是单位向量，也可以再来着色器代码中进行归一化
    // var x = -1/Math.sqrt(14), y = -2/Math.sqrt(14), z = -3/Math.sqrt(14);
    var x = -1/Math.sqrt(3), y = -1/Math.sqrt(3), z = -1/Math.sqrt(3);
    gl.uniform3f(u_lightPosition,x,y,-z);

    gl.enable(gl.DEPTH_TEST)
    const t=()=>{
        const all=10*1000;
        const angleY=(Date.now()%all)/all*360
        const angle=gl.getUniformLocation(program,"u_angle")
        gl.uniform3f(angle,30,angleY,0)
        gl.clearColor(.2, .3, .4, .5)//每一帧都要刷新背景颜色
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLES,0,36)//每一帧都要重绘
        window.requestAnimationFrame(()=>{t()})
    }
    t();
   

}


// learn1()
// learn2()
// learn3()
// learn4()
learn5()
