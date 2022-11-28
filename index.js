import readline from 'readline'
import { Parking } from './parking'

// create parking space
let parking = new Parking();
//message when parking is created
console.log("Parking system is created....")
// selection to system action
let prompt = 'Select action [p - park, u - unpark, m - map, x - exit]:'
const readL = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt
})

readL.prompt()
readL.on('line', (line) => {
    switch (line.trim()) {
        // exit
        case 'x':
            readL.close()
            break
        // park
        case 'p':
            readL.question('Vehicle size [0-S, 1-M, 2-L]:', function (v) {
                let strEntrance = parking.ENTRANCE.map((e) => e.name).join(',')
                readL.question(`Entrance [${strEntrance}]:`, function (entrance) {
                    parking.park(v, entrance)
                    readL.prompt()
                })
            })
            break
        //unpark
        case 'u':
            readL.question('Location of vehicle to unpark. Separate by a space [row column]:', function (loc) {
                let strLoc = loc.trim().split(' ')
                //
                if (strLoc.length >= 2) {
                    let row = strLoc[0]
                    let col = strLoc[1]
                    parking.unpark(row, col)
                    console.log('Vehicle successfully unparked!')
                }
            })
            break
        // map
        case 'm':
            parking.viewMap()
            break
        default:
            break;
    }
    readL.prompt();
}).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
});
readL.on("close", function () {
    console.log("Thank you! We are pleased to serve you.")
    process.exit(0)
})