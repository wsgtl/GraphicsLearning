
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
/**传顶点数据 */
function setData(gl: WebGLRenderingContext,program:WebGLProgram,name:string,data: BufferSource,size: GLint, type: GLenum, normalized: GLboolean=false, stride: GLsizei=0, offset: GLintptr=0){
    const arg=gl.getAttribLocation(program,name)

    const pb=gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER,pb)
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW)
    gl.vertexAttribPointer(arg,2,gl.FLOAT,false,0,0)
    gl.enableVertexAttribArray(arg)
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

        // gl.uniform3f(angle,50,angleY+10,0)
        // gl.drawArrays(gl.TRIANGLES,0,36)//画另一个立方体
        
        window.requestAnimationFrame(()=>{t()})
    }
    t();
   

}

/**练习6 纹理贴图和调整灰度和宏定义 */
function learn6(){
    const gl=initWebgl()
    const isGrey=true;//利用预处理宏定义控制灰度显示
    const fShader=(isGrey?" #define GREY true;\n":"")+
    `
    precision mediump float;
    varying vec2 v_TexCoord;
    uniform sampler2D u_Sampler;
    void main(){
        #ifdef GREY
        //采集纹素
        vec4 texture = texture2D(u_Sampler,v_TexCoord);
        //计算RGB三个分量光能量之和，也就是亮度
        float luminance = 0.299*texture.r+0.587*texture.g+0.114*texture.b;
        //逐片元赋值，RGB相同均为亮度值，用黑白两色表达图片的明暗变化
        gl_FragColor = vec4(luminance,luminance,luminance,texture.a);
        return;
        #endif

        gl_FragColor = texture2D(u_Sampler,v_TexCoord);
    }
`
    const program=initShader(gl, `
    attribute vec4 v_position;
    attribute vec2 a_TexCoord;//纹理坐标
    varying vec2 v_TexCoord;
    void main(){
        gl_Position=v_position;
        v_TexCoord=a_TexCoord;
    }
    `,fShader)  

 
    //  四个顶点坐标数据data，z轴为零
    //   定义纹理贴图在WebGL坐标系中位置

    var data=new Float32Array([
        -0.5, 0.5,//左上角——v0
        -0.5,-0.5,//左下角——v1
        0.5,  0.5,//右上角——v2
        0.5, -0.5 //右下角——v3
    ]);
    
     //创建UV纹理坐标数据textureData

    var textureData = new Float32Array([
        0,1,//左上角——uv0
        0,0,//左下角——uv1
        1,1,//右上角——uv2
        1,0 //右下角——uv3
    ]);

    const position=gl.getAttribLocation(program,'v_position')
    const texCoord=gl.getAttribLocation(program,'a_TexCoord')

    const pb=gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER,pb)
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW)
    gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0)
    gl.enableVertexAttribArray(position)

    
    const tpb=gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER,tpb)
    gl.bufferData(gl.ARRAY_BUFFER,textureData,gl.STATIC_DRAW)
    gl.vertexAttribPointer(texCoord,2,gl.FLOAT,false,0,0)
    gl.enableVertexAttribArray(texCoord)


   

    const sam=gl.getUniformLocation(program,"u_Sampler")
    const img=new Image()
    img.src='img.png'
    img.onload=()=>{texture(gl,img,sam)}

    
    
   
}

 /**创建缓冲区textureBuffer，传入图片纹理数据，然后执行绘制方法drawArrays() **/

function texture(gl: WebGLRenderingContext,image:TexImageSource,sam: WebGLUniformLocation){
    const texture=gl.createTexture()//创建纹理图像缓冲区
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true)//纹理图片上下反转
    // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1)//将图像RGB颜色值的每一个分量乘以A默认值为false	
    gl.activeTexture(gl.TEXTURE0)//激活0号纹理单元TEXTURE0
    gl.bindTexture(gl.TEXTURE_2D,texture)//绑定纹理缓冲区
    //设置纹理贴图填充方式（纹理贴图像素尺寸大于顶点绘制区域像素尺寸）
    // target		gl.TEXTURE_2D或gl.TEXTURE_BUVE_MAP
    //             分别代表二维纹理和立方体纹理
    // pname		纹理参数，可选值：
    //             gl.TEXTURE_MAG_FILTER 纹理放大方法，默认值gl.LINEAR
    //             gl.TEXTURE_MIN_FILTER 纹理缩小方法，默认值gl.NEAREST_MIPMAP_LINEAR
    //             gl.TEXTURE_WRAP_S	  纹理水平填充，默认值gl.REPEAT
    //             gl.TEXTURE_WRAP_T     纹理垂直填充，默认值gl.REPEAT
    // param		纹理参数的值，
    //             当pname为gl.TEXTURE_MAG_FILTER或gl.TEXTURE_MIN_FILTER
    //                 可选值：
    //                 gl.NEAREST	使用原纹理上距离映射后像素（新像素）中心最近的那个
    //                             像素的颜色值，作为新像素的值
    //                 gl.LINEAR	使用距离新像素中心最近的四个像素的颜色的加权平均值，
    //                             作为新像素的值，图像效果更好，但开销较大
    //             当pname为gl.TEXTURE_WRAP_S或gl.TEXTURE_WRAP_T
    //                 可选值：
    //                 gl.REPEAT			平铺式的重复纹理
    //                 gl.MIRRORED_REPEAT	镜像对称式的重复纹理
    //                 gl.CLAMP_TO_EDGE	使用纹理图像边缘值				
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR)
     //设置纹理贴图填充方式(纹理贴图像素尺寸小于顶点绘制区域像素尺寸)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR)
    //设置纹素格式，jpg格式对应gl.RGB
    // target			gl.TEXTURE_2D或gl.TEXTURE_BUVE_MAP
    // 分别代表二维纹理和立方体纹理
    // level			传入0 （该参数用于金字塔纹理）
    // internalformat	图像的内部格式，可选值：
    //     gl.RGB	红、绿、蓝
    //     gl.RGBA	红、绿、蓝、透明度
    //     gl.ALPHA （0.0,0.0,0.0，透明度）
    //     gl.LUMINANCE  L、L、L、1L：流明
    //     gl.LUMINANCE_ALPHA  L、L、L，透明度
    // format			纹理数据的格式，必须使用与internalformat相同的值
    // type			纹理数据的数据格式，可选值：
    //     gl.UNSIGNED_TYPE  无符号整型，每个颜色分量占据1字节
    //     gl.UNSIGNED_SHORT_5_6_5	 RGB：每个分量分别占据5、6、5比特
    //     gl.UNSIGNED_SHORT_4_4_4_4 RGBA：每个分量都占据4比特
    //     gl.UNSIGNED_SHORT_5_5_5_1 RGBA：每个分量分别占据5、5、5、1比特

    // image			包含纹理图像的Image对象
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image)
    gl.uniform1i(sam,0)//纹理缓冲区单元TEXTURE0中的颜色数据传入片元着色器,跟activeTexture()中激活的几号纹理单元对应
      // 进行绘制
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
// learn1()
// learn2()
// learn3()
// learn4()
// learn5()
learn6()
 /**创建缓冲区textureBuffer，传入图片纹理数据，然后执行绘制方法drawArrays() **/

 function texture1(gl: WebGLRenderingContext,image:TexImageSource,sam: WebGLUniformLocation){
   const tex=gl.createTexture()
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true)
   gl.activeTexture(gl.TEXTURE0)
   gl.bindTexture(gl.TEXTURE_2D,tex)
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR)
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR)
   gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image)
   gl.uniform1i(sam,0)
   gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
}