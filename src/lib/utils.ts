function resolveString(input: string, rep: Record<string, string> = {}): string {
    const now = new Date();

    const replacements = {
        "%date%": now.toISOString().slice(0, 10),
        "%datetime%": now.toISOString(),
        "%timestamp%": now.getTime().toString(),
        ...rep,
    };

    let output = input;
    for (const [key, value] of Object.entries(replacements))
        output = output.replace(new RegExp(key, 'g'), value);

    return output;
}

const utils = {
    resolveString,
}

export default utils;