import {Canvas} from "@react-three/fiber";
import { HoudiniSphere } from './HoudiniSphere';

type GLSphereProps = {

};

const GLSphere = ({}: GLSphereProps) => {
    return (
    <Canvas>
        <HoudiniSphere position={[-2, 0, 2]} />
    </Canvas>
    );
};

export default GLSphere;