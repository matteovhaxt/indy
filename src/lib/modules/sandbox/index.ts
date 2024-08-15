import { ProcessOutput, type RunningSandbox, Sandbox } from 'e2b'
import { env } from '$env/dynamic/private'

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
            metadata: {
                template,
            },
            apiKey: env.E2B_API_KEY,
        })

        return {
            sandbox,
        }
    } catch (error) {
        console.error('createSandbox', error)
        throw new Error('Failed to create Sandbox')
    }
}

export const getSandbox = async (
    template: SandboxTemplate
): Promise<{ sandbox: RunningSandbox | undefined }> => {
    try {
        const allSandboxes = await Sandbox.list()

        const sandboxInfo = allSandboxes.find((sbx) => sbx.templateID === template)

        return {
            sandbox: sandboxInfo,
        }
    } catch (error) {
        console.error('getSandbox', error)
        throw new Error('Failed to get Sandbox')
    }
}

export const connectToSandbox = async (
    template: SandboxTemplate,
    timeout: number = sandboxTimeout
): Promise<{ sandbox: Sandbox }> => {
    try {
        const allSandboxes = await Sandbox.list()

        const sandboxInfo = allSandboxes.find((sbx) => sbx.templateID === template)

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
        const allSandboxes = await Sandbox.list()
    
        const sandboxInfo = allSandboxes.find((sbx) => sbx.templateID === template)
    
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

        await sandbox.filesystem.write(path, content)

        const url = `https://${sandbox.getHostname(3000)}/${path}`

        return {
            url,
        }
    } catch (error) {
        console.error('writeToFile',    error)
        throw Error('Failed to write to file')
    }
}

export const readFromFile = async (
    template: SandboxTemplate,
    path: string
): Promise<{ content: string }> => {
    try {
        const { sandbox } = await connectToSandbox(template)
    
        const content = await sandbox.filesystem.read(path)

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

        await sandbox.filesystem.remove(path)
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
): Promise<{ files: string[] }> => {
    try {
        const { sandbox } = await connectToSandbox(template)

        let fileTree: string[] = []

        async function getFileTree(path: string) {
            if (path.includes('node_modules')) {
                return
            }

            const files = await sandbox.filesystem.list(path, {
                timeout: sandboxTimeout,
            })

            for (const file of files) {
                if (file.isDir) {
                    fileTree.push(file.name)
                    getFileTree(path + '/' + file.name)
                }
            }
        }

        getFileTree(path)

        return {
            files: fileTree,
        }
    } catch (error) {
        console.error('getFileTree', error)
        throw Error('Failed to get file tree')
    }
}