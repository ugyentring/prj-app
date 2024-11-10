document.getElementById("conditions").addEventListener("click",(e) => {
    e.preventDefault()
    showTermsAndCondition()
})
function showTermsAndCondition() {
    document.getElementById("termsAndCondition").style.display = "flex";
}

function closeTermsAndCondition() {
    document.getElementById("termsAndCondition").style.display = "none";
}

document.addEventListener('DOMContentLoaded', () => {
    const selectDrop = document.getElementById('countries');

    fetch('https://restcountries.com/v3.1/all').then(res => {
        return res.json();
    }).then(data => {
        // console.log(data)
        let output = "";
        data.forEach(country => {
            // console.log(country.name.common)
            output += `<option value="$country.name.common}">${country.name.common}</option>`;
        })
        selectDrop.innerHTML = output;
    }).catch(err => {
        console.log(err)
    })
})

