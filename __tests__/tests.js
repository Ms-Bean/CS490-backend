let server_url="http://localhost:3500/";

describe("Healthcheck test", () => {
    test('Testing health check', async () => {
        let response = await fetch(server_url + "healthcheck/",{
            method: "GET",
            mode: "cors"
        }).catch(error=>{
            fail("error");
        });
        let data = await response.text().catch(error =>{
            fail("error");
        });
        fetched_string = JSON.parse(data).value;
        expect(fetched_string).toBe("Hello world");
    });
})
describe("Get film info test", () => {

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
                console.log(data);
            })
        }
    });

describe("get actor info test", () => {
    test_cases = [4,5,6];
    for(let i = 0; i < test_cases.length; i++)
    {
        test('get actor info test', async () => {
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
            console.log(data);
        })
    }
});

describe("get actor info test", () => {
    test_cases_actor = [7,8,9];
    for(let i = 0; i < test_cases_actor.length; i++)
    {
        test('get actor info test', async () => {
            let response = await fetch(server_url + "get_actor_info/",{
                method: "GET",
                mode: "cors",
                headers: {
                    "actor_id": test_cases_actor[i]
                },
            })
            let data = await response.text();
            switch(test_cases_actor[i])
            {
                case 7:
                    expect(JSON.parse(data).result_table[0].first_name).toBe("GRACE");
                    expect(JSON.parse(data).result_table[0].last_name).toBe("MOSTEL");
                    break;
                case 8:
                    expect(JSON.parse(data).result_table[0].first_name).toBe("MATTHEW");
                    expect(JSON.parse(data).result_table[0].last_name).toBe("JOHANSSON");
                    break;
                case 9:
                    expect(JSON.parse(data).result_table[0].first_name).toBe("JOE");
                    expect(JSON.parse(data).result_table[0].last_name).toBe("SWANK");
                    break;
            }
        })
    }
});