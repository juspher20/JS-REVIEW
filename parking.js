import util from 'util'

export class Parking {

    constructor() {
        this.MAX_COLS = 8
        this.MAX_ROWS = 5
        // lets initialize our parking slots
        this.PARK = new Array(this.MAX_ROWS).fill(null).map(() => new Array(this.MAX_COLS).fill(null))
        // lets create spaces with random data
        this.initSpaces()
        // define our entrance points
        this.ENTRANCE = [
            { name: 'A', row: 0, col: 2 },
            { name: 'B', row: 0, col: 6 },
            { name: 'C', row: this.MAX_ROWS, col: 3 },
        ]

    }
    // check map
    viewMap() {
        console.log(util.inspet(this.PARK, {
            showHidden: false,
            colors: true,
            compact: true,
            depth: null
        }))
    }
    // check if parking slot is available
    park(size, ent) {
        let entrance = this.ENTRANCE.find(o => o.name === ent.toUpperCase())
        let numrow = -1, numcol = -1
        let distance = 999

        // search for the nearest parking space
        for (let i = 0; i < this.MAX_ROWS; i++) {
            for (let j = 0; j < this.MAX_COLS; j++) {
                if (!this.isGateway(i, j)) {
                    let p = this.PARK[i][j]
                    if (size <= p.psize.value) {
                        // check if vehicle fits in parking slot
                        let computedDistance = Math.abs(entrance.row - p.row) + Math.abs(entrance.col - p.col)
                        if (distance > computedDistance && !p.occupied) {
                            distance = computedDistance
                            numrow = i
                            numcol = j
                        }
                    }
                }
            }
        }

        if (numrow == -1) {
            console.log('No parking slot found')
            return false
        } else {
            Object.assign(this.PARK[numrow][numcol], {
                occupied: true,
                vsize: {
                    value: parseInt(size),
                    desc: this.getVehicleDesc(size)
                },
                row: numrow,
                col: numcol,
                start: new Date()
            })
            return this.PARK[numrow][numcol]
        }
    }
    //lets get vehicle desc
    getVehicleDesc(size) {
        switch (parseInt(size)) {
            case 0:
                //Small
                return 'S'
                break
            case 1:
                // Medium
                return 'M'
                break
            case 2:
                //Large
                return 'L'
                break
            default:
                // Null
                return ''
        }
    }

    //unpark
    unpark(row, col) {
        let p = this.PARK[row][col]
        let diff = (new Date()) - p.start
        //display charges
        let totalPayable = this.compute(p.psize.value, diff)
        console.log(`Total charges: P ${totalPayable}`)
        //reset parking slots
        Object.assign(this.PARK[row][col], {
            occupied: false,
            vsize: null,
            start: null
        })
    }
    // compute the total charges based on parking size and total time park
    compute(size, totalTime) {
        let remainingTime = totalTime
        let t24 = 1000 * 60 * 24
        let t1h = 1000 * 60
        let charges = 0

        var hourlyCharge = 0

        if (size == 0) {
            hourlyCharge = 20
        } else if (size == 1) {
            hourlyCharge = 60
        } else if (size == 2) {
            hourlyCharge = 100
        }
        // if parking is exceeds to 24 hours, charged 5,000 pesos regardless of parking slot
        if (remainingTime > t24) {
            let n24 = parseInt(totalTime / t24)
            charges += n24 * 5000
            remainingTime -= (n24 * t24)
        }
        // first 3 hours has a flat rate of 40
        if (remainingTime > (t1h * 3)) {
            remainingTime -= (t1h * 3)
            charges += 40
        }
        // exceeding hourly rate beyond the initial 3 hours will be charged as fallows:
        // - 20/hour for vehicles parked in SP;
        // 60/hour for vehicles parked in MP; and
        // - 100/hour for vehicles parked in LP
        if (remainingTime > 0) {
            let remainingHours = Math.ceil(remainingTime / t1h)
            charges += remainingHours * hourlyCharge
        }
        // total charges
        return charges
    }
    // gateways
    isGateway(row, col) {
        if (col == 0 || row == 0 || row == this.MAX_ROWS - 1 || col == this.MAX_COLS - 1) {
            return true
        } else {
            return false
        }
    }
    // validation size
    isValidSise(size) {
        if (size >= 0 && size <= 2) {
            return true
        } else {
            return false
        }
    }
    // get the randome size
    getRandomSize() {
        // SP = 0,  MP = 1, LP = 2
        const max = 2
        const min = 0
        const descriptors = ['SP', 'MP', 'LP']
        const size = Math.round(Math.random() * (max - min) + min)
        const desc = descriptors[size]
        return {
            value: size,
            desc: desc
        }
    }

}