document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const todayDate = `${year}${month}${day}`;

    const apiUrl = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=N10&SD_SCHUL_CODE=8140246&MLSV_YMD=${todayDate}`;

    fetch(apiUrl)
        .then(response => response.text())
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");

            const result = xmlDoc.querySelector("RESULT > MESSAGE").textContent;

            if (result === "정상 처리되었습니다.") {
                const rows = xmlDoc.getElementsByTagName("row");
                let mealContent = '';

                for (let i = 0; i < rows.length; i++) {
                    const mealType = rows[i].getElementsByTagName("MMEAL_SC_NM")[0].textContent;
                    const dishes = rows[i].getElementsByTagName("DDISH_NM")[0].textContent.replace(/<br\/>/g, ', ');
                    const calories = rows[i].getElementsByTagName("CAL_INFO")[0].textContent;

                    mealContent += `
                        <div class="meal-info">
                            <div class="meal-type">${mealType}</div>
                            <p><strong>메뉴:</strong> ${dishes}</p>
                            <p><strong>칼로리:</strong> ${calories}</p>
                        </div>
                    `;
                }

                document.getElementById('meal-result').innerHTML = mealContent;
            } else {
                document.getElementById('meal-result').innerHTML = `<p>급식 정보를 찾을 수 없습니다.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching meal data:', error);
            document.getElementById('meal-result').innerHTML = `<p>오류가 발생했습니다. 다시 시도해주세요.</p>`;
        });
});
