"use strict";

var TotemPole = function(options) {
    var defaults = {
        x: 0,
        y: 0,
        blocks: [],
        color: 0,
        spawnBlocks: 0
    };

    for(var key in defaults) {
        if(!options.hasOwnProperty(key)) {
            this[key] = defaults[key];
        } else {
            this[key] = options[key];
        }
    }
};

TotemPole.prototype.update = function(canShoot) {
    // Iterate blocks from bottom to top
    var supportedLevel = this.y - BLOCK_HEIGHT * 0.5;
    var chain = 0;
    for (var i = this.blocks.length - 1; i >= 0; --i) {
        this.blocks[i].canShoot = canShoot;
        this.blocks[i].update(supportedLevel);
        if (this.blocks[i].state != TotemBlock.SWAPPING) {
            supportedLevel = this.blocks[i].y - BLOCK_HEIGHT;
        } else {
            supportedLevel -= BLOCK_HEIGHT;
        }
        if (this.blocks[i].type === TotemBlock.Type.EMPTY && this.blocks[i].state == TotemBlock.SUPPORTED) {
            chain++;
        } else {
            chain = 0;
        }
        if (chain == 2 && MATCH_THREE_EMPTY) {
            this.blocks.splice(i, 2);
            var topIndex = i - 1;
            if (topIndex >= 0 && this.blocks[topIndex].state != TotemBlock.SWAPPING) {
                this.blocks[topIndex].state = TotemBlock.FALLING;
            }
            chain = 0;
            this.spawnBlocks += BEAVER_SPAWN_BLOCKS;
        }
    }
};

TotemPole.prototype.addHead = function() {
    var headY = this.blocks[0].y - BLOCK_HEIGHT;
    this.blocks.splice(0, 0, new TotemBlock({x: this.x, y: headY, type: TotemBlock.Type.HEAD, hitpoints: -1}));
};

TotemPole.prototype.render = function() {
    for(var j = 0; j < this.blocks.length; j++) {
        this.blocks[j].render(this.color);
    }
};

TotemPole.prototype.blockCount = function(type) {
    var total = 0;
    for(var j = 0; j < this.blocks.length; j++) {
        if (this.blocks[j].type === type) {
            ++total;
        }
    }
    return total;
};

TotemPole.prototype.isInitialized = function() {
    return this.blocks.length > 0 && this.blocks[0].type == TotemBlock.Type.HEAD;
};
