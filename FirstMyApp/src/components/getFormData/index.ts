export const getFormData = (JsonObject: { [key: string]: any }, RemoveKeys: string[] = []) => {
    const formData = new FormData();
    if (JsonObject) {
        Object.keys(JsonObject).forEach(key => {
            if (JsonObject[key] !== undefined && !RemoveKeys.includes(key)) { formData.append(key, JsonObject[key]); }
        });
        return formData;
    } else {
        return null;
    }
};