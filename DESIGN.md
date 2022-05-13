# Languge Spec

## Introduction



- Syntax is meant to be simple, free and “speakable”
- The syntax will be largely inspired by JSON
- Like GraphQL, the structure of the query greatly influences the shape the data is returned
- The syntax is largely based on “blocks” that determine the shape/structure of the returned scraped data and also how the data is scraped. (see below section)
- All queries start with a single block (should expression blocks be allowed?)
- Comments are defined using the “#” character
    - only single line comments supported at the moment

    ```jsx
    # this is a comment
    ```


## Blocks

- A block is a **structure / entity** (would I call it a structure?) used to define the shape/structure of the returned queried/scraped data
- Blocks are essential part of Scrapeium and are what makes Scrapeium as dynamic/flexible as it is.
- There are 3 types of blocks:
    - **Array blocks**
        - Array blocks represent an array values
        - Array block are designed to handle multiple elements
        - Array blocks can be used to query many items on a website
        - can either have an expression block or object block as a child block
            - Use expression block if you want an array of primitives
            - Use a object if you want an array of objects (see Object Blocks section for more details)
        - Every array block requires a **block prefix**
            - see below

            ```jsx
            // this is an example of a block prefix
            "h1" > [...]
            // in this example, this tells the assocciated array block to query over every h1 tag and "loop" over each one with the provided child block
            // this means in the result array, there will be an item for every h1 on the page (the value and type of the item being det
            ```

            - If an object block is used as the child block, it results in an array of objects
            - If an expression block is used as the child block, it results in an array of primitive values
        - If the block prefix contains a selector, while the array block loops over each element that matches that selector, a few relevant variables will be defined that can be used in an expression block. This is done to make the code more compact and easier to read. (see expression block section below)
            - Another way of saying this is that as the query is executed, certain variables are stored based the context of the block and cascade down to child blocks to have access to them
        - The best way to think of an array block is a `for each` loop, where the block prefix is the condition for the loop (or array of (potential) values) and the child block is the function executed for each of the elements
        - Examples

        ```jsx

        // this query queries all ".item" elements and loops over them with an expression block
        // this query results in an array of strings (the innter text of every ".item" element)

        // <h1 class="item">hello</h1>
        // <h1 class="item">hi</h1>

        ".item" > [(
        		read :inner-text
        )]
        // ["hello", "hi"]

        // this query results in an array of objects, where the each object has a name key with a value of the inner text of each queried element
        ".item" > [{
        	name = read :inner-text,
        }]
        // [{name: "hello"}, {name: "hi"}]
        ```

    - **Object blocks**
        - an object block is used to structure pairs of key and values
        - the syntax for key values is `key = value`
            - can be seen as the key equals value
        - results in an object with the matching structure
        - keys are normal identifiers while values can be any block type
        - ley value paors all operate in their own scope (what happens in another key value pair does not affect another)
            - although they do inherit scope from thier parent obkect bloc
        - key-value pairs are comma separated and trailing commas are mandatory
            - this is because it makes it easier to add new key-value pairs to an object block
        - if a value of a key is a simple expression (one line) then the brackets should be optional
        - if the parent to an object block is an array block, the object block acts as a “model” for multiple items in a potential array (most like likely use of object blocks)
        - Examples

        ```jsx

        // <div id="name">Ben</div>
        // <div id="age">10</div>
         {
        	name = (
        		select "#name"
        		read :inner-text
        	),
        	age = (
        		select "#age"
        		read :inner-text
        	),
        }
        // { name: "ben", age: "10" }
        ```

    - **Expression blocks**
        - Expression blocks are used to execute expressions and statements that interact with the website and return a primitive data type
        - Expression block are designed to work on an single element at a time and the return a value
        - have their own scope (but variables can be defined by context)
            - Expression blocks can access variables defined by the context of an array block (see variables below)
        - returns the result of the last line/ expression
        - has to return a primitive value (explained below)
        - **Expression blocks MUST return a value that is not null/none**
        - if you only had one expression to evaluate, you could use a short hand and omit the brackets **(think about this)**
        - can be used in conjunction with other blocks
        - when an expression is used in other blocks, the `()` must be used
        - but if an expression block is the root/first/only block then the brackets can be ommited
        - Example

        ```jsx
        // <div id="message">This is cool</div>

        // how can a block prefix be used for an expression block? provide the :element variable?
        "#messages" > (
        	select "#message"
        	read :inner-text
        )

        // if it is done this way, something like this will be possible

        {
        	name = "#message" > read :inner-text // like a shorthand syntax almost
        }

        // think about this... how do we handle simple queries like this?
        // in this case should the brackets just be ignored

        // syntax like this is generally not recomended
        // using an object block is best practice as the value is named with a key

        // I can technically say that the brackets are only nessessary when used in other blocks
        // so as a root block it should be fine without them

        (
        	select "#message"
        	read :inner-text
        )

        // result = "This is cool"
        ```


## **Block prefix**

- A block prefix is an entity/structure that is used to describe the context of which any block will operate under/ how they are executed
- For expression blocks and object blocks they define the `:element` variable that the block works with (unless explicily changed)
- Block prefixes are required for array blocks as they define the context of which the array will be filled (the `:elements` variable )
- the context defined by a block prefix can be passed down to subsequent child blocks
- This entity is useful as this can be used to reduce repetition where the same element is used in multiple blocks
- Can be used to greatly simplify queries and reduce the use of multiple query statements
- Variables will continue to cascade/trickle down unless explicitly (using something like query/select statement) or implicitly changed (like using a block prefix)

```jsx
# instead of doing something like this

{
	name = (
		query ".info"
		select :first_child
		read :inner_text
	),

	age = (
		query ".info"
		select :last_child
		read :inner_text
	),
}

# you can do this instead

".info" > {
	name = (
		select :first_child
		read :inner_text
	),

	age = (
		select :last_child
		read :inner_text
	),
}

# can be used to make expression block smaller

# without block prefix
{
	name = (
		query ".name"
		read :inner_text
	),
}

# with block prefix
{
	name = ".name" > read :inner_text,
}
```

## **Primitive types**


- This is a list of types that are native to the language
- primitive types can only really be used in expression blocks
    - number
        - positive integers
        - floats (might not be *fully implemented in v1)
    - string
    - boolean (might not be implemented in v1)
    - blocks

## **Variables**


- variables are saved values that information can be read from and manipulated
- all block have their own scope, but they also inherit scope down from their parent blocks (cascading variables)
- all predefined variables are read only
- variables are signified as `:variable_name`
    - all variables are based on snake case
- at the beginning of the query, all of these variables will be null
- some might only be set by certain blocks or statements
- List of defined available variables (some might be null based on context)
    - `:count` → (should this be called `:index`) current number (integer) of times the current array block has been run (can be thought of as an index value in a for each loop)This variable is defined by the internal loop carried out by an array block. **think of better explanation**
        - might not be implemented in v1
    - `:element` → a reference to the current selected element (can it be null?) (might not really be used in a query, maybe only internally). This variable will change with each element in array block if the block prefix contains a selector (like looping over an array of elements). By default this will be null. **think of better explanation**
    - `:first_child` → a reference to the first child of the `:element` if any
    - `:last_child` →  a reference to the last child of the `:element` if any
    - `:next_sibling` →  a reference to the next sibling of the `:element` if any
    - `:elements` → (think about this one) reference to a list of queried elements. This will only be defined by an array block with a selector in its block prefix. By default this will be null.
    - `:id` → id of the current element (read from `:element`) can be null
    - `:src` → element has an src attribute, the `:src` variable will be set to the elements src value. Otherwise, it will be null
    - `:href` → element has an href attribute, the `:href` variable will be set to the elements href value. Otherwise, it will be null
    - `:class` → class of the current (read from `:element`) can be null
    - `:inner_text` → the inner text of the current element (read from `:element`) can be null
    - `:inner_html` → inner html of the current element (read from `:element`) can be null

    ```jsx
     (
    	query ".name"; // this would set the :element variable and return none/null
    	read_attribute "hello"; // result of this wold be stored in :attibute-value and return its value
    	// in this case this is the same as
    )
    ```


use camel case for statements and variables???

## **Statements**


- In Expression block, statements can be used to manipulate variables, get data from the queried sites and return data to be used in other block
    - List of available statements
        - also based in snake case
        - `query` → queries a single/first element using a provided selector. If result is null, then an error is thrown. Saves the result to the `:element` variable (mostly for internal use). Returns none/null
            - `query "selector"`
        - `select` → changes the `:element` variable based on some other defined variable taht relates to the current element
            - `select :first_child`
        - `read` → reads the value of a variable in scope and returns its value
            - `read :inner-text`
            - `read :innerText`
        - `read_attribute` → reads specific attribute from `:element` variable and returns it as a string.
            - `readAttibute`
            - `read_attribute "tagName"`
            - `read-attribute "tagName"`
        - `~~set` → defines a local variable with a supplied primitive value (think about this) returns the assigned value~~ (not going to implement this... yet)
        - `~~click` → does a (left) mouse click on an element (if no selector is provided, it will use the `:element` variable instead) Returns none~~
        - `~~loop` → loop over an element `n` times (think about this one)~~
        - `trim` → trim whitespace characters from the string (saves it back in the variable) (try and automatically do this)
        - `to_number` → takes given express/variable and returns as number (might be a float or integer)
            - `to_number :inner_text`
        - `to_boolean` → takes a given variable and returns as an appropriate boolean


Note: even though things like blocks might not return anything themselves, their structure is “committed” to a global object at runtime, saving all the information from scraping to the global object. This is the object that is returned when the query is executed
