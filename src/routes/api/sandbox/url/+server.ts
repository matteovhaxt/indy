import { json } from "@sveltejs/kit";
import { connectToSandbox, SandboxTemplate } from "$lib";

export async function GET() {
    const { sandbox } = await connectToSandbox(SandboxTemplate.NextJS);

    const url = `https://${sandbox.getHostname(3000)}`

    return json({ url });
}