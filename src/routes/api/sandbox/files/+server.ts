import { json } from "@sveltejs/kit";
import { getFileTree, SandboxTemplate } from "$lib";

export async function GET() {
    const { files } = await getFileTree(SandboxTemplate.NextJS, ".");

    return json({
        files
    });
}