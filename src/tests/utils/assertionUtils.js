async function captureExpectResult(expectPromise) {
    try {
        await expectPromise;
        return { passed: true, error: null };
    } catch (error) {
        return { passed: false, error };
    }
}

// Export the function
module.exports = { captureExpectResult };
