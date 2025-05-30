import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export default function SceneContent({ page }) {
  const group = useRef();
  const hansel = useRef();
  const gretel = useRef();

  const hanselMixer = useRef();
  const gretelMixer = useRef();

  const actions = useRef({
    hansel: { forward: null, backward: null },
    gretel: { forward: null, backward: null },
  });

  const currentDirection = useRef(null); // 'forward' or 'backward'
  const isMoving = useRef(false);

  // Handle keypress for movement direction
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        currentDirection.current = 'forward';
        isMoving.current = true;
      } else if (e.key === 'ArrowLeft') {
        currentDirection.current = 'backward';
        isMoving.current = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        isMoving.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const loader = new FBXLoader();

    // Load Hansel base model
    loader.load('/models/hansel.fbx', (model) => {
      model.scale.set(0.01, 0.01, 0.01);
      model.position.set(-2, -1.5, 0);
      hansel.current = model;
      group.current.add(model);

      hanselMixer.current = new THREE.AnimationMixer(model);

      // Load Hansel animations
      loader.load('/models/M_f_Walking.fbx', (anim) => {
        actions.current.hansel.forward = hanselMixer.current.clipAction(anim.animations[0]);
      });
      loader.load('/models/M_b_Walking.fbx', (anim) => {
        actions.current.hansel.backward = hanselMixer.current.clipAction(anim.animations[0]);
      });
    });

    // Load Gretel base model
    loader.load('/models/gretel.fbx', (model) => {
      model.scale.set(0.01, 0.01, 0.01);
      model.position.set(2, -1.5, 0);
      gretel.current = model;
      group.current.add(model);

      gretelMixer.current = new THREE.AnimationMixer(model);

      // Load Gretel animations
      /*loader.load('/models/gretel_forward.fbx', (anim) => {
        actions.current.gretel.forward = gretelMixer.current.clipAction(anim.animations[0]);
      });
      loader.load('/models/gretel_backward.fbx', (anim) => {
        actions.current.gretel.backward = gretelMixer.current.clipAction(anim.animations[0]);
      });*/
    });
  }, []);

  // Helper to play only one action at a time
  const playAction = (mixer, actionsObj, direction) => {
    if (!actionsObj.forward || !actionsObj.backward) return;

    const toPlay = actionsObj[direction];
    const toStop = direction === 'forward' ? actionsObj.backward : actionsObj.forward;

    toStop.stop();


    toPlay.reset();
    toPlay.setLoop(THREE.LoopOnce, 1);
    toPlay.clampWhenFinished = true;
    toPlay.fadeIn(0.2).play();

      // Stop movement flag after animation ends
    mixer.addEventListener('finished', () => {
    isMoving.current = false;
   });
  };

  useFrame((_, delta) => {
    if (hanselMixer.current) hanselMixer.current.update(delta);
    if (gretelMixer.current) gretelMixer.current.update(delta);

    if (isMoving.current && currentDirection.current) {
      playAction(hanselMixer.current, actions.current.hansel, currentDirection.current);
      playAction(gretelMixer.current, actions.current.gretel, currentDirection.current);
    }

    // Position objects based on page (story scene)
    const positions = {
  1: { hansel: [-2, -1.5, 0], gretel: [2, -1.5, 0], house: [0, -100, 0], witch: [0, -100, 0] },
  2: { hansel: [-2, -1.5, -3], gretel: [2, -1.5, -3], house: [0, -100, 0], witch: [0, -100, 0] },
  3: { hansel: [-2, -1.5, -6], gretel: [2, -1.5, -6], house: [0, -1.5, -8], witch: [0, -100, 0] },
  4: { hansel: [-2, -1.5, -9], gretel: [2, -1.5, -9], house: [0, -1.5, -10], witch: [1, -1.5, -10] },
  5: { hansel: [-2, -1.5, -10], gretel: [2, -1.5, -10], house: [0, -1.5, -10], witch: [1, -1.5, -9] },
  6: { hansel: [-2, -1.5, -11], gretel: [2, -1.5, -11], house: [0, -1.5, -12], witch: [0, -1.5, -12] },
  7: { hansel: [-2, -1.5, -13], gretel: [100, -100, 0], house: [0, -100, 0], witch: [0, -100, 0] },
  8: { hansel: [-2, -1.5, -15], gretel: [100, -100, 0], house: [0, -100, 0], witch: [0, -100, 0] }
};


    const target = positions[page];
    if (target) {
      if (hansel.current) hansel.current.position.set(...target.hansel);
      if (gretel.current) gretel.current.position.set(...target.gretel);
    }
  });

  return <group ref={group} />;
}
