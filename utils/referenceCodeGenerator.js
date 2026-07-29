const generateReferenceCode = (prefix) => {
    const now = new Date();
    const year = now.getFullYear();
    const timestamps = Date.now();
    return `${prefix}-${year}-${timestamps}`
}

module.exports = {generateReferenceCode}