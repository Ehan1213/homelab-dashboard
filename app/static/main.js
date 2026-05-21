async function getServices() {
    const url = "http://localhost:5000/services";
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
    }
};



async function getServiceChecks(uuid) {
    const url = `http://localhost:5000/services/${uuid}/checks`;

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


async function postServiceChecks(uuid, status = 'up', response_time = Null) {
    const url = `http://localhost:5000/services/${uuid}/checks`;

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
    const container = document.querySelector('#services-list');
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
        const item = document.createElement('li');
        item.textContent = service.name;
        item.dataset.serviceId = service.id;
        item.addEventListener("click", () => {
            const checks = getServiceChecks(item.dataset.serviceId);
            renderChecks(checks);
        });
        container.appendChild(item);
    };

};

function renderChecks(service) {
    for (let check of data) {

    }
}

window.addEventListener("load", async () => {
    renderServices(await getServices())
})