
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
    gl.drawArrays(gl.TRIANGLES, 0, 3)
}
learn1()
