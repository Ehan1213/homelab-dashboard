const baseUrl = "http://localhost/api"

async function getServices() {
    const url = `${baseUrl}/services`;
    try {
        clearError()
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status:  ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        showError(error.message);
        return []
    }
};



async function getServiceChecks(uuid) {
    const url = `${baseUrl}${uuid}/checks`;

    try {
        clearError()
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status:  ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result
    } catch (error) {
        showError(error.message);
    }
};


async function postServiceChecks(uuid, status = 'up', response_time = null) {
    const url = `${baseUrl}/services/${uuid}/checks`;

    try {
        clearError()
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ status: status, response_time: response_time }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Response status:  ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        return result

    } catch (error) {
        showError(error.message);
    }
};


function renderServices(data) {
    const container = document.querySelector('#services-container');
    if (!container) {
        return
    };
    container.replaceChildren();
    if (data.length == 0) {
        const item = document.createElement('li');
        item.textContent = "No Services added yet";
        container.appendChild(item);
        return
    }

    for (let service of data) {
        const item = document.createElement('details');
        item.dataset.serviceId = service.id;
        const summary = document.createElement('summary');
        const spanStatus = document.createElement('span')
        if (service.latest_check) {
            spanStatus.textContent = service.latest_check.status
            switch (service.latest_check.status) {
                case 'up': {
                    spanStatus.style.color = "green"

                }
                case 'down': {
                    spanStatus.style.color = "red"

                }
                case 'degraded': {
                    spanStatus.style.color = "orange"

                }
            }
            const spanTime = document.createElement('span')
            spanTime.textContent = service.latest_check.created_at
            summary.textContent = `${service.name} ${service.url} ${spanStatus} ${spanTime}`

        } else {
            summary.textContent = `${service.name} ${service.url}`;
        }

        item.appendChild(summary)
        const ul = item.appendChild(document.createElement('ul'));
        ul.className = "checks-list";

        item.addEventListener("toggle", async (event) => {
            if (!event.target.open) {
                return
            };
            const uuid = event.target.dataset.serviceId;
            const ul = event.target.querySelector('.checks-list');
            if (ul.children.length > 0) {
                return
            }
            ul.textContent = 'Loading checks...'
            const checks = await getServiceChecks(uuid);
            renderChecks(ul, checks);
        });
        container.appendChild(item);
    };

};

function renderChecks(ul, checks) {
    if (checks.length == 0) {
        const li = document.createElement('li')
        li.textContent = "No checks yet"
        ul.appendChild(li)
        return
    }
    for (let check of checks) {
        const li = document.createElement('li')
        li.textContent = `Status: ${check.status} Response time: ${check.response_time} Timestamp: ${check.created_at}`
        ul.appendChild(li)

    }
    return
}

function showError(message) {
    const banner = document.querySelector('#error-banner');
    banner.textContent = message;
    banner.style.dissplay = 'block';
}

function clearError() {
    const banner = document.querySelector('#error-banner');
    banner.textContent = '';
}

async function postForm(formData) {
    const url = `${baseUrl}/services`;

    try {
        clearError()
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ name: formData.get('name'), url: formData.get('url'), check_interval_seconds: Number(formData.get('check_interval_seconds')) }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Response status:  ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        return result

    } catch (error) {
        showError(error.message);
    }


}

window.addEventListener("load", async () => {
    const container = document.querySelector('#services-container');
    container.textContent = 'Loading...'
    renderServices(await getServices());
    const form = document.getElementById('add-service-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        await postForm(formData);
        renderServices(await getServices());
    })
})

