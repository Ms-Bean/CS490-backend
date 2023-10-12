let server_url="http://localhost:3500/";
test_cases = [107,102,198];
for(let i = 0; i < test_cases.length; i++)
{
    test('get actor info test', async () => {
        let response = await fetch(server_url + "get_actor_info/",{
            method: "GET",
            mode: "cors",
            headers: {
                "actor_id": test_cases[i]
            },
        })
        let data = await response.text();
        expect(JSON.parse(data).failure).toBe(0);
        switch(test_cases[i])
        {
            case 4:
                expect(JSON.parse(data).result_table[0].first_name).toBe("GINA");
                break;
            case 5:
                expect(JSON.parse(data).result_table[0].title).toBe("WALTER");
                break;
            case 6:
                expect(JSON.parse(data).result_table[0].title).toBe("MARY");
                break;
        }
    })
}
