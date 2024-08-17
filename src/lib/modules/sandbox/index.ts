import { ProcessOutput, type RunningSandbox, Sandbox } from 'e2b'

export enum SandboxTemplate {
    NextJS = '9flqu3n29i2wj7901du0',
}

const sandboxTimeout = 60 * 1000

export const createSandbox = async (
    template: SandboxTemplate
): Promise<{ sandbox: Sandbox }> => {
    try {
        const sandbox = await Sandbox.create({
            template,
        })

        return {
            sandbox,
        }
    } catch (error) {
        console.error('createSandbox', error)
        throw new Error('Failed to create Sandbox')
    }
}

export const getSandboxInfo = async (
    template: SandboxTemplate
): Promise<{ sandboxInfo: RunningSandbox | undefined }> => {
    try {
        const allSandboxes = await Sandbox.list()

        const sandboxInfo = allSandboxes.find((sbx) => sbx.templateID === template)

        return {
            sandboxInfo,
        }
    } catch (error) {
        console.error('getSandboxInfo', error)
        throw new Error('Failed to get Sandbox info')
    }
}

export const connectToSandbox = async (
    template: SandboxTemplate,
    timeout: number = sandboxTimeout
): Promise<{ sandbox: Sandbox }> => {
    try {
        const { sandboxInfo } = await getSandboxInfo(template)

        if (!sandboxInfo) {
            return await createSandbox(template)
        }
    
        const sandbox = await Sandbox.reconnect(sandboxInfo.sandboxID)
        await sandbox.keepAlive(timeout)

        return {
            sandbox,
        }
    } catch (error) {
        console.error('connectToSandbox', error)
        throw Error('Failed to connect to Sandbox')
    }
}

export const deleteSandbox = async (
    template: SandboxTemplate
): Promise<void> => {
    try {
        const { sandboxInfo } = await getSandboxInfo(template)

        if (!sandboxInfo) {
            throw Error('Sandbox not found')
        }

        await Sandbox.kill(sandboxInfo.sandboxID)
    } catch (error) {
        console.error('deleteSandbox',  error)
        throw Error('Failed to delete Sandbox')
    }
}

export const writeToFile = async (
    template: SandboxTemplate,
    path: string,
    content: string
): Promise<{ url: string }> => {
    try {
        const { sandbox } = await connectToSandbox(template)

        const dir = path.split('/').slice(0, -1).join('/')

        if (dir !== '') {
            await sandbox.filesystem.makeDir(dir)
        }

        await sandbox.filesystem.write('home/user/' + path, content)

        const url = `https://${sandbox.getHostname(3000)}`

        return {
            url,
        }
    } catch (error) {
        console.error('writeToFile', error)
        throw Error('Failed to write to file')
    }
}

export const readFromFile = async (
    template: SandboxTemplate,
    path: string
): Promise<{ content: string }> => {
    try {
        const { sandbox } = await connectToSandbox(template)

        const content = await sandbox.filesystem.read('home/user/' + path)

        return {
            content,
        }
    } catch (error) {
        console.error('readFromFile', error)
        throw Error('Failed to read from file')
    }
}

export const deleteFile = async (
    template: SandboxTemplate,
    path: string
): Promise<void> => {
    try {
        const { sandbox } = await connectToSandbox(template)

        await sandbox.filesystem.remove('home/user/' + path)
    } catch (error) {
        console.error('deleteFile', error)
        throw Error('Failed to delete file')
    }
}

export const runCommand = async (
    template: SandboxTemplate,
    command: string
): Promise<{ output: ProcessOutput }> => {
    try {
        const { sandbox } = await connectToSandbox(template)

        const output = await sandbox.process.startAndWait(command)

        return {
            output,
        }
    } catch (error) {
        console.error('runCommand', error)
        throw Error('Failed to run command')
    }
}

export const getFileTree = async (
    template: SandboxTemplate,
    path: string
): Promise<{ [key: string]: {} | null; }> => {
    try {
        const { sandbox } = await connectToSandbox(template)

        async function buildFileTree(path: string): Promise<{ [key: string]: {} | null; }> {
            const files = await sandbox.filesystem.list(path, {
                timeout: sandboxTimeout,
            })

            const treeNode: { [key: string]: {} | null; } = {}

            for (const file of files) {
                if (file.name.startsWith('.') || file.name === 'node_modules') {
                    continue
                }

                const filePath = `${path}/${file.name}`;
                if (file.isDir) {
                    treeNode[file.name] = await buildFileTree(filePath);
                } else {
                    treeNode[file.name] = null;
                }
            }

            return treeNode
        }

        const rootPath = `home/user/${path}`;
        const fileTree = await buildFileTree(rootPath);

        return {
            files: fileTree,
        }
    } catch (error) {
        console.error('getFileTree', error)
        throw Error('Failed to get file tree')
    }
}