import {Canvas} from "@react-three/fiber";
import {Model as TheSphere} from './TheSphere';
import {SpikePoints} from './HoudiniSpherePoints3';
type GLSphereProps = {

};

const GLSphere = ({}: GLSphereProps) => {
    return (
    <Canvas>
        <SpikePoints position={[-2, 0, 2]} />
    </Canvas>
    );
};

export default GLSphere;