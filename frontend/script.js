// Generic function to handle form submissions
async function handleForm(formId, apiEndpoint) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
        const response = await fetch(`/api/${apiEndpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                form.reset();
                try {
                    const modalId = formId.replace('Form', 'Modal');
                    const modalEl = document.getElementById(modalId);
                    if (modalEl) {
                        bootstrap.Modal.getInstance(modalEl).hide();
                    }
                } catch (_) { /* ignore modal close errors */ }
                alert('सफलतापूर्वक सबमिट किया गया!');
                return; // done — skip the else and the catch
            } else {
                alert('सर्वर एरर! कृपया बाद में प्रयास करें।');
            }
        } catch (error) {
            alert('सर्वर एरर! कृपया बाद में प्रयास करें।');
        }
    });
}

// Initialize both forms
handleForm('complaintForm', 'complaint');
handleForm('membershipForm', 'membership');


