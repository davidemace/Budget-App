export function oneRosterResponse(data: any, resourceType: string) {
    return {
        [resourceType]: data,
    };
}