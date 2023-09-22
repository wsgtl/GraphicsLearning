// 引入three.js
// import * as THREE from 'three';
// 创建3D场景对象Scene
const scene = new THREE.Scene();
//创建一个长方体几何对象Geometry
const geometry = new THREE.BoxGeometry(100, 100, 100); 
//创建一个材质对象Material
const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,//0xff0000设置材质颜色为红色
}); 
// 两个参数分别为几何体geometry、材质material
const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
//设置网格模型在三维空间中的位置坐标，默认是坐标原点
mesh.position.set(0,10,0);
scene.add(mesh); 

// 创建渲染器对象
const renderer = new THREE.WebGLRenderer();
// 定义相机输出画布的尺寸(单位:像素px)
const width = 800; //宽度
const height = 500; //高度
renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
// 实例化一个透视投影相机对象
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
// 根据需要设置相机位置具体值
camera.position.set(200, 200, 200); 
//相机观察目标指向Threejs 3D空间中某个位置
camera.lookAt(mesh.position);//指向mesh对应的位置
renderer.render(scene, camera); //执行渲染操作
document.body.appendChild(renderer.domElement);

