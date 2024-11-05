import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/fbx';

@Component({
  selector: 'app-scene',
  template: '<canvas #renderCanvas id="renderCanvas"></canvas>',
  styles: [`
    #renderCanvas {
      width: 100%;
      height: 100vh;
      touch-action: none;
    }
  `]
})
export class SceneComponent implements OnInit {
  @ViewChild('renderCanvas', { static: true }) renderCanvas!: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngOnInit() {
    const canvas = this.renderCanvas.nativeElement;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    // Camera
    const camera = new ArcRotateCamera('camera', 0, Math.PI / 3, 10, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Light
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // Load FBX Model
    SceneLoader.ImportMesh('', 'assets/models/', 'model.fbx', scene, function (meshes) {
      // Adjust scale if needed
      meshes.forEach(mesh => {
        mesh.scaling = new Vector3(0.1, 0.1, 0.1);
      });
      
      // Auto rotate camera around the model
      scene.registerBeforeRender(() => {
        camera.alpha += 0.01;
      });
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });
  }
}