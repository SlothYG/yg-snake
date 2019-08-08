<template>
    <div class="wapper">
        <!-- 棋盘容器 -->
        <div class="snake-content">
            <ul v-for="(item, index) in box[0]" :key="index">
                <!-- <li v-for="(aitem, aindex) in box[1]" :key="aindex" :ref="'r'+ item + 'c'+ aitem"></li> -->
                <li v-for="(aitem, aindex) in box[1]" :key="aindex" :ref='`r${index}`'>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "snake",
        data() {
            return {
                snakeArr: [],
                box: [30, 30], // 棋盘大小
                bodyLength: 3, // 初始化蛇身的长度
                snakeDirection: undefined,
                wait: true,
                snakeMoveTimer: null,
                snakeMoveSpeed: 200, // 蛇的移动速度
                snakeFood: undefined, // 食物坐标
            }
        },
        mounted() {
            // 初始化一条蛇的坐标
            this.snakeInit();
            this.$nextTick(() => {
                this.gameStart();
                this.bindKeycode();
                this.createFood();
            })
        },
        methods: {
            // 让我我们确认一条蛇的坐标
            snakeInit() {
                const {
                    box,
                    snakeArr,
                    bodyLength,
                    snakeDirection
                } = this;
                // 然后，我们确认一个狗…蛇头坐标，因为我们想让这条蛇随机出现在棋盘的各个位置
                let snakeHead = [parseInt(Math.random() * box[0]), parseInt(Math.random() * box[1])];

                // 先添加到蛇的坐标中
                snakeArr.push(snakeHead);

                // 然后来料理蛇身
                let snakeBody = snakeHead;
                let randomNum = parseInt(Math.random() * 4);

                switch (randomNum) {
                    case 0:
                        // 不让出现在边缘
                        if (snakeHead[0] >= 3) {
                            this.snakeDirection = 'down';
                        } else {
                            this.snakeDirection = 'up';
                        }
                        break;

                    case 1:
                        // 不让出现在边缘
                        if (box[0] - snakeHead[0] >= 3) {
                            this.snakeDirection = 'up';
                        } else {
                            this.snakeDirection = 'down';
                        }
                        break;

                    case 2:
                        // 不让出现在边缘
                        if (snakeHead[1] >= 3) {
                            this.snakeDirection = 'right';
                        } else {
                            this.snakeDirection = 'left';
                        }
                        break;

                    case 3:
                        // 不让出现在边缘
                        if (box[1] - snakeHead[1] >= 3) {
                            this.snakeDirection = 'left';
                        } else {
                            this.snakeDirection = 'right';
                        }
                        break;
                    default:
                        break;
                }
                for (let index = 0; index < bodyLength; index++) {
                    switch (randomNum) {
                        case 0:
                            // 不让出现在边缘
                            if (snakeHead[0] > 3) {
                                snakeBody = [snakeBody[0] - 1, snakeBody[1]]
                            } else {
                                snakeBody = [snakeBody[0] + 1, snakeBody[1]]
                            }
                            break;

                        case 1:
                            // 不让出现在边缘
                            if (box[0] - snakeHead[0] > 3) {
                                snakeBody = [snakeBody[0] + 1, snakeBody[1]]
                            } else {
                                snakeBody = [snakeBody[0] - 1, snakeBody[1]]
                            }
                            break;

                        case 2:
                            // 不让出现在边缘
                            if (snakeHead[1] > 3) {
                                snakeBody = [snakeBody[0], snakeBody[1] - 1]
                            } else {
                                snakeBody = [snakeBody[0], snakeBody[1] + 1]
                            }
                            break;

                        case 3:
                            // 不让出现在边缘
                            if (box[1] - snakeHead[1] > 3) {
                                snakeBody = [snakeBody[0], snakeBody[1] + 1]
                            } else {
                                snakeBody = [snakeBody[0], snakeBody[1] - 1]
                            }
                            break;
                        default:
                            break;
                    }
                    // 添加到蛇的坐标中
                    snakeArr.push(snakeBody);
                }
                // 
                this.snakeDraw()
            },

            // 创建一个食物
            createFood() {
                const {
                    snakeArr,
                    box: [x, y]
                } = this;
                while (true) {
                    const row = Math.floor(Math.random() * x);
                    const col = Math.floor(Math.random() * y);
                    for (let index = 0; index < snakeArr.length; index++) {
                        const [a, b] = snakeArr[index];
                        if (row != a && col != b) {
                            this.snakeFood = [row, col];
                            const food = this.$refs[`r${row}`][col];
                            food.className = 'snake-food';
                            return;
                        }
                    }
                }
            },

            // 出局规则
            isSnakeRule() {
                const {
                    snakeArr,
                    box,
                } = this;
                for (let index = 1; index < snakeArr.length; index++) {
                    if (snakeArr[0][0] == snakeArr[index][0] && snakeArr[0][1] == snakeArr[index][1]) {
                        return false;
                    }
                }
                if (parseInt(snakeArr[0][0]) < 0 || parseInt(snakeArr[0][1]) < 0 || parseInt(snakeArr[0][0]) == box[
                        0] || parseInt(snakeArr[0][1]) == box[1]) {
                    return false;
                } else {
                    return true;
                }
            },

            // 让我们画出这条蛇皮吧
            snakeDraw() {
                const {
                    snakeArr
                } = this;
                for (let index = 0; index < snakeArr.length; index++) {
                    const li = this.$refs[`r${snakeArr[index][0]}`][snakeArr[index][1]];
                    if (index == 0) {
                        li.className = 'snake-head'
                    } else {
                        li.className = 'snake-body'
                    }
                }
                this.wait = true;
            },

            // 接下来我们应该让这个动起来
            snakeMove() {
                let {
                    snakeArr,
                    snakeDirection,
                    snakeFood: [foodx, foody]
                } = this;
                let newHead = []; // 移动方向头
                switch (snakeDirection) {
                    case 'left':
                        newHead = [snakeArr[0][0], snakeArr[0][1] - 1]
                        break;
                    case 'right':
                        newHead = [snakeArr[0][0], snakeArr[0][1] + 1]
                        break;
                    case 'up':
                        newHead = [snakeArr[0][0] - 1, snakeArr[0][1]]
                        break;
                    case 'down':
                        newHead = [snakeArr[0][0] + 1, snakeArr[0][1]]
                        break;

                    default:
                        break;
                }
                // 把原先的头和尾弄出来
                let oldHeadLi = this.$refs[`r${snakeArr[0][0]}`][snakeArr[0][1]];

                // 移动之后，原先头的作为是蛇身，蛇尾的坐标为空
				oldHeadLi.className = 'snake-body';
				
                // 判断是否吃到食物
                if (snakeArr[0][0] == foodx && snakeArr[0][1] == foody) {
					this.createFood();
                } else {
					const [row, col] = snakeArr.pop();
					const oldFootLi = this.$refs[`r${row}`][col];
                	oldFootLi.className = '';
				}

				this.snakeArr.unshift(newHead);


                if (this.isSnakeRule()) {
                    this.snakeDraw();
                } else {
                    clearInterval(this.snakeMoveTimer)
                }
            },


            /**
             * 按键改变移动方向
             */
            bindKeycode() {
                document.onkeydown = ({
                    keyCode
                }) => {
                    const {
                        snakeDirection,
                        wait
                    } = this;
                    switch (keyCode) {

                        // 向左
                        case 37:
                            if (snakeDirection != "right" && wait) {
                                this.snakeDirection = "left";
                                this.wait = false;
                            }
                            break;

                            // 向上
                        case 38:
                            if (snakeDirection != "down" && wait) {
                                this.snakeDirection = "up";
                                this.wait = false;
                            }
                            break;

                            // 向右
                        case 39:
                            if (snakeDirection != "left" && wait) {
                                this.snakeDirection = "right";
                                this.wait = false;
                            }
                            break;

                            // 向下
                        case 40:
                            if (snakeDirection != "up" && wait) {
                                this.snakeDirection = "down";
                                this.wait = false;
                            }
                            break;

                            // 空格
                        case 32:
                            // 暂停游戏
                            break;
                    }
                }
            },

            /**
             * 开始的时候，应当执行一段定时器
             */
            gameStart() {
                let {
                    snakeMoveTimer,
                    snakeMoveSpeed
                } = this;
                this.snakeMoveTimer = setInterval(this.snakeMove, snakeMoveSpeed);
            },

        },
    }

</script>

<style lang="scss" scoped>
    .snake-content {
        padding: 10px;

        ul {
            display: flex;

            li {
                width: 14px;
                height: 14px;
                display: block;
                border: 1px solid #6cf;
            }
        }

        .snake-food {
            background-color: red;
        }

        .snake-body {
            background-color: rgba($color: #39C5BB, $alpha: 0.6)
        }

        .snake-head {
            background-color: #39C5BB;
        }

    }

</style>
