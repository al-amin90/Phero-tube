const btnContainer = document.getElementById("btn-container");
const cardContainer = document.getElementById("card-container");
const errorElement = document.getElementById("error-element");

let categorieId = 1000;
const sorted = false;

function sortBtn() {
    fetchDataByCategory(categorieId, true)
}

const fetchCategories = async () => {
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/categories`)
    const {data} = await res.json()
    data.forEach(categorie => {
        const button = document.createElement("button");
        button.innerText = categorie.category;
        button.className = `btn btn-ghost py-2 px-5 bg-[#25252526] text-[#252525B3] text-base focus:bg-[#FF1F3D] focus:text-white`;
        button.addEventListener("click", () => fetchDataByCategory(categorie.category_id))
        btnContainer.appendChild(button)
    });
}

const fetchDataByCategory = async (id, sorted) => {
    categorieId = id;
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
    const { data } = await res.json()
    cardContainer.innerHTML = '';

    if (sorted) {
        data.sort((a, b) => {
            const first = parseFloat(a.others.views);
            const second = parseFloat(b.others.views);
            return second - first
        })
        console.log(data)
    }

    if (data.length === 0) {
        errorElement.classList.remove("hidden");
    }
    else {
        errorElement.classList.add("hidden")
    }

    data.forEach(video => {
        // console.log(video)
        let verifiedBadge = '';
        let verifiedTime = '';
        if (video.authors[0].verified) {
            verifiedBadge = `<img class="w-6 h-6" src="./images/verify.png"}">`
        }
        if (video.others.posted_date) {
            verifiedTime = `<h6 class="absolute bottom-[5%] bg-black text-white rounded-full px-4 py-1 right-3">${mileToTime(video.others.posted_date)} ago</h6>`;
        }

        const divCard = document.createElement("div");
        divCard.innerHTML = `
            <div class="">
                <figure class="relative">
                    <img class="w-full rounded-lg overflow-hidden h-52" src="${video.thumbnail}" alt="Shoes" />
                    ${verifiedTime}
                </figure>
                <div class="mt-5">
                    <div class="flex space-x-3">
                        <div class="">
                            <img class="w-10 aspect-square rounded-full" src="${video.authors[0].profile_picture}" alt="Shoes" />
                        </div>
                        <div>
                            <h2 class="card-title text-[#171717] font-bold">${video.title}</h2>
                            <div class="flex mt-2">
                                <p class="mr-2">${video.authors[0].profile_name}</p>
                                ${verifiedBadge}
                            </div>
                            <p class="mt-2">${video.others.views} Views</p>
                        </div>
                    </div>
                </div>
            </div>
        `
        cardContainer.appendChild(divCard)
    })
}


const mileToTime = (Se) => {
    let minuts = Math.floor(Se / 60);
    let hours = Math.floor(minuts / 60);

    minuts = minuts % 60;
    hours = hours % 24;
    return hours + " Hrs " + minuts + " Min";
}


fetchCategories()
fetchDataByCategory(categorieId, sorted)