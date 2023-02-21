import {Canvas} from "@react-three/fiber";
import { HoudiniSphere } from './HoudiniSphere';
import {SpotLight} from "@react-three/drei";

type GLSphereProps = {

};

const GLSphere = ({}: GLSphereProps) => {
    return (
    <Canvas className="">
        <pointLight position={[10, 10, 10]} intensity={1.0}/>
        <HoudiniSphere position={[-2, 0, 2]} />
    </Canvas>
    );
};

export default GLSphere;