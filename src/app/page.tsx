import { Controls, Layouts } from "components";

export default function Home() {
    return (
        <Layouts.Col>
            <Layouts.Row>
                <Controls.Button>button</Controls.Button>
                <Controls.Button variant="line">button</Controls.Button>
                <Controls.Button variant="solid">button</Controls.Button>
            </Layouts.Row>
            <Layouts.Row>
                <Controls.Button variant="solid" color="red">
                    button
                </Controls.Button>
                <Controls.Button variant="solid" color="blue">
                    button
                </Controls.Button>
                <Controls.Button variant="solid" color="purple">
                    button
                </Controls.Button>
            </Layouts.Row>
            <Layouts.Row>
                <Controls.Button variant="solid" color="orange" radius={0.5}>
                    button
                </Controls.Button>
                <Controls.Button variant="solid" color="green" radius={1.5}>
                    button
                </Controls.Button>
                <Controls.Button variant="solid" color="sky" radius={2}>
                    button
                </Controls.Button>
            </Layouts.Row>
            <Layouts.Row>
                <Controls.Button
                    variant="solid"
                    color="orange"
                    radius={0.5}
                    style={{ backgroundImage: "linear-gradient(45deg, #f00, #00f)" }}>
                    button
                </Controls.Button>
                <Controls.Button variant="solid" color="green" radius={1.5}>
                    button
                </Controls.Button>
                <Controls.Button variant="solid" color="sky" radius={2}>
                    button
                </Controls.Button>
            </Layouts.Row>
        </Layouts.Col>
    );
}
