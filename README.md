# GPT-Neo Sandbox

Qucikly make project demos based on GPT-Neo.

## Setting Up

1. Set the `SANDBOX_TOKEN` environment variable to a Hugging Face Inference API Token.
2. Add a subdirectory named `config` to the `src` directory, and add `template.txt` and `sandbox.json`, as talked about below.
3. Run `npm run build`.
4. Run `npm run start`.
5. Play around.

## Config Files

There are two required configuration files.

### template.txt

This file is passed as the prompt, replacing `{input}` with the user input.

```
Solve the math problem:
Problem: 6 - 9
Solution: -3
###
Problem: 7 + 1
Solution: 8
###
Problem: {input}
Solution: 
```

### sandbox.json

This file is used to configure the project.

```json
{
    "title": "Math Solver",
    "input": {
        "mode": "singleline",
        "prompt": "Problem"
    },
    "output": {
        "offset": 90,
        "plus": true
    },
    "backend": {
        "model": "gpt-neo-2.7B",
        "temperature": 0.1 
    }
}
```

The `title` is placed at the top of the page.

The `input` block describes the textbox in the demo. For now, `mode` can only be `singleline`. `prompt` is the placeholder of the textbox.

The `output` block says how the result is displayed. `offset` being how much to trim from the beginning of the generated text (useful to take out the examples given to GPT-Neo), and if `plus` is `true`, then it adds the length of the input to the offset.

Finally, `backend` contains the model to use, and optionally, the `temperture` and `penalty` for repeating.
Note: there is an error caused by using an integer or float with only trailing zeroes (such as 23.0) in these values, I will look into this soon.