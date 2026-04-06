// Generic function to handle form submissions
async function handleForm(formId, apiEndpoint) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`http://localhost:5000/api/${apiEndpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('सफलतापूर्वक सबमिट किया गया!');
                form.reset();
                bootstrap.Modal.getInstance(document.getElementById(formId.replace('Form', 'Modal'))).hide();
            }
        } catch (error) {
            alert('सर्वर एरर! कृपया बाद में प्रयास करें।');
        }
    });
}

// Initialize both forms
handleForm('complaintForm', 'complaint');
handleForm('membershipForm', 'membership');


