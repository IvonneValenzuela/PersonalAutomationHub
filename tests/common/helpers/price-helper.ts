export function parsePrice(text: string | null): number {
    const cleaned = text?.replace(/[^0-9.]/g, '') ?? '0';
    return Number(cleaned);
}

export async function getPriceFromText(text: string | null): Promise<number> {
    return parsePrice(text);
}
