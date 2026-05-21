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
        return result;
    } catch (error) {
        showError(error.message);
        return []
    }
};



async function getServiceChecks(uuid) {
    const url = `${baseUrl}/services/${uuid}/checks`;

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
        return []
    }
};


async function postServiceChecks(uuid, status = 'up', response_time_ms = null) {
    const url = `${baseUrl}/services/${uuid}/checks`;

    try {
        clearError()
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ status: status, response_time_ms: response_time_ms }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Response status:  ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        return result;

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
        const details = document.createElement('li');
        details.textContent = "No Services added yet";
        container.appendChild(details);
        return
    }

    for (let service of data) {
        const details = document.createElement('details');
        details.dataset.serviceId = service.id;
        const summary = document.createElement('summary');
        const spanStatus = document.createElement('span')
        if (service.latest_check) {
            spanStatus.textContent = ' ' + service.latest_check.status + ' ';
            switch (service.latest_check.status) {
                case 'up': {
                    spanStatus.style.color = "green"
                    break
                }
                case 'down': {
                    spanStatus.style.color = "red"
                    break
                }
                case 'degraded': {
                    spanStatus.style.color = "orange"
                    break
                }
            }
            summary.textContent = `${service.name} ${service.url}`
            spanStatus.style.marginLeft = '8px';

            summary.appendChild(spanStatus)

            const spanTime = document.createElement('span')
            spanTime.textContent = ' ' + service.latest_check.created_at + ' ';
            spanTime.style.marginLeft = '8px'
            summary.appendChild(spanTime)
        } else {
            summary.textContent = `${service.name} ${service.url}`;
        }
        details.appendChild(summary);

        const ul = document.createElement('ul');
        ul.className = "checks-list";
        details.appendChild(ul);

        const recordBtn = document.createElement('button');
        recordBtn.textContent = 'Record Check';
        details.appendChild(recordBtn);

        const checkForm = document.createElement('div');
        checkForm.style.display = 'none';

        const select = document.createElement('select');
        const opt1 = document.createElement('option');
        opt1.value = 'up', opt1.textContent = 'up';
        select.appendChild(opt1);
        const opt2 = document.createElement('option');
        opt2.value = 'down', opt2.textContent = 'down';
        select.appendChild(opt2);
        const opt3 = document.createElement('option');
        opt3.value = 'degraded', opt3.textContent = 'degraded';
        select.appendChild(opt3);
        const rtInput = document.createElement('input');
        rtInput.type = 'number';
        rtInput.placeholder = 'Response time (ms)';
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit'
        checkForm.appendChild(select);
        checkForm.appendChild(rtInput);
        checkForm.appendChild(submitBtn);
        details.append(checkForm);

        recordBtn.addEventListener('click', (event) => {
            if (checkForm.style.display === 'none') {
                checkForm.style.display = 'block'
            } else {
                checkForm.style.display = 'none'
            };
        });

        submitBtn.addEventListener('click', async (event) => {
            const status = select.value;
            let responseTime = rtInput.value;
            responseTime = responseTime ? Number(responseTime) : null;
            const response = await postServiceChecks(service.id, status, responseTime);
            const checks = await getServiceChecks(service.id);
            console.log('submit checks:', checks);
            console.log('submit ul:', ul);
            renderChecks(ul, checks);
            renderServices(await getServices())
            checkForm.style.display = 'none'

        });

        details.addEventListener("toggle", async (event) => {
            if (!event.target.open) {
                return
            };
            const uuid = event.target.dataset.serviceId;
            const ul = event.target.querySelector('.checks-list');
            // if (ul.children.length > 0) {
            //     return
            // }
            ul.textContent = 'Loading checks...'
            const checks = await getServiceChecks(uuid);
            console.log('checks received:', checks);
            renderChecks(ul, checks);
        });
        container.appendChild(details);

    };

};

function renderChecks(ul, checks) {
    ul.replaceChildren();
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

