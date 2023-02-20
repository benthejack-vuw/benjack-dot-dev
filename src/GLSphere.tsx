import {Canvas} from "@react-three/fiber";
import {Model as TheSphere} from './TheSphere';

type GLSphereProps = {

};

const GLSphere = ({}: GLSphereProps) => {
    return (
    <Canvas>
        <TheSphere position={[-2, 0, 2]} />
    </Canvas>
    );
};

export default GLSphere;