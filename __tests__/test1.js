let server_url="http://localhost:3500/";

test_cases = [4,5,6];
for(let i = 0; i < test_cases.length; i++)
{
    test('Get film info test', async () => {
        let response = await fetch(server_url + "get_film_info/",{
            method: "GET",
            mode: "cors",
            headers: {
                "film_id": test_cases[i]
            },
        })
        let data = await response.text();
        expect(JSON.parse(data).failure).toBe(0);
        switch(test_cases[i])
        {
            case 4:
                expect(JSON.parse(data).result_table[0].title).toBe("AFFAIR PREJUDICE");
                break;
            case 5:
                expect(JSON.parse(data).result_table[0].title).toBe("AFRICAN EGG");
                break;
            case 6:
                expect(JSON.parse(data).result_table[0].title).toBe("AGENT TRUMAN");
                break;
        }
    })
}
