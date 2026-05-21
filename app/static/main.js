async function getServices() {
    const url = "http://127.0.0.1:5000/services";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status:  ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error.message);
        return []
    }
};



async function getServiceChecks(uuid) {
    const url = `http://127.0.0.1:5000/services/${uuid}/checks`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status:  ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result
    } catch (error) {
        console.error(error.message);
    }
};


async function postServiceChecks(uuid, status = 'up', response_time = null) {
    const url = `http://127.0.0.1:5000/services/${uuid}/checks`;

    try {
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
        console.error(error.message);
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
        summary.textContent = `${service.name} ${service.url}`;
        item.appendChild(summary)
        const ul = item.appendChild(document.createElement('ul'));
        ul.className = "checks-list";

        item.addEventListener("toggle", async (event) => {
            if (!event.target.open) {
                return
            };
            const uuid = event.target.dataset.serviceId;
            let ul = event.target.querySelector('.checks-list');
            if (ul.children.length > 0) {
                return
            }
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

async function postForm(formData) {
    const url = `http://127.0.0.1:5000/services`;

    try {
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
        console.error(error.message);
    }


}

window.addEventListener("load", async () => {
    renderServices(await getServices())
    const form = document.getElementById('add-service-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        await postForm(formData);
        renderServices(await getServices());
    })
})

