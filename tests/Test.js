import Entity from '../source/MongoDB'

class Test extends Entity {

}

Test.type = {
    id: String,
    string: String,
    number: Number,
    float: Number,
    object: Object,
    empty_object: Object,
    arrayOfStrings: Array,
    arrayOfObjects: Array,
}

Test.defaultValues = {
    string: 'Placeholder',
    number: 10,
    float: 9.9,
    object: { x_pos: 0, y_pos: 0 },
    empty_object: {},
    arrayOfStrings: [
        'Value 1', 'Value 2', 'Value 3', 'Value 4'
    ],
    arrayOfObjects: [
        {
            name: "Name 1",
            age: 10
        },
        {
            name: "Name 2",
            age: 10,
            arrayOfObjects: [
                { x_pos: 100, y_pos: 100 },
                { x_pos: 200, y_pos: 200 },
                { x_pos: 300, y_pos: 300 },
                { x_pos: 400, y_pos: 400 },
                { x_pos: 500, y_pos: 500 }]
        },
        {
            name: "Name 3",
            age: 10
        },
        {
            name: "Name 4",
            age: 10
        }
    ]
}

export default Test