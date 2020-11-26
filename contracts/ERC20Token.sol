//"SPDX-License-Identifier: MIT"
pragma solidity ^0.7.5;
import "hardhat/console.sol";

contract ERC20Token {

    //function totalSupply() view public returns (uint256 supply) {}

    function balanceOf(address _owner) virtual view public returns (uint256 balance) {}

    function transfer(address _to, uint256 _value) virtual public returns (bool success) {}

    function transferFrom(address _from, address _to, uint256 _value) virtual public returns (bool success) {}

    function approve(address _spender, uint256 _value) virtual public returns (bool success) {}

    function allowance(address _owner, address _spender) virtual view public returns (uint256 remaining) {}

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);   
}

interface Interface_TDD{
    function check1(address _eoa) external view returns(bool _isGood);
}

contract AriesCoin is ERC20Token {
    using SafeMath for uint256;
    using AddressUtils for address;

    string public name;
    uint8 public decimals;
    string public symbol;
    string public version = '1.0';

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;
    uint256 public totalSupply;

    constructor(string memory _tokenSymbol) {
        console.log("sc deploying erc20", _tokenSymbol);
        //console.log("Changing Symbol from '%s' to '%s'", tokenSymbol, _tokenSymbol);

        totalSupply = 80 * (10**24);//in 1000 * base 18
        balances[msg.sender] = totalSupply;
        //balances[msg.sender] = totalSupply-1000;
        //balances[addr1] = 1000;
        name = "AriesCoin";
        decimals = 18;
        symbol = _tokenSymbol;
    }

    // function approveAndCall(address _spender, uint256 _value, bytes memory _extraData) public returns (bool success) {
    //     allowed[msg.sender][_spender] = _value;
    //     emit Approval(msg.sender, _spender, _value);

    //     // if(!_spender.call(bytes4(bytes32(keccak256("receiveApproval(address,uint256,address,bytes)"))), 
    //     //     msg.sender, _value, this, _extraData)) { revert(); }
    //     // return true;
    // }
    
    function transfer(address _to, uint256 _value) override public returns (bool success) {
        console.log("Sender balance: %s tokens", balances[msg.sender]);
        console.log("About to send %s tokens to %s", _value, _to);

        require(balances[msg.sender] >= _value, "Not enough tokens");
        // _to.isContract()
        if (balances[msg.sender] >= _value && _value > 0) {
            balances[msg.sender] -= _value;
            // balances[msg.sender] = balances[msg.sender].sub(_value)
            
            if(balances[_to] + _value > balances[_to]){
                balances[_to] += _value;
                emit Transfer(msg.sender, _to, _value);
                return true;
            } else { return false; }
        } else { return false; }
    }

    function transferFrom(address _from, address _to, uint256 _value) override public returns (bool success) {
        console.log("AddrTo balances: %s tokens", balances[_from], balances[_to]);
        console.log("About to send %s tokens to %s", _value, _to);
        if (balances[_from] < _value) {
          console.log("_from balance not enough");
          return false;
        } else if (allowed[_from][msg.sender] < _value) {
          console.log("msg.sender allowance not enough");

        } else if ( _value <= 0) {
          console.log("_value not enough");

        } else {
            allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
            balances[_from] = balances[_from].sub(_value);
            balances[_to] = balances[_to].add(_value);
            emit Transfer(_from, _to, _value);
            console.log("transferFrom returns true");
            return true;
        }
    }

    function balanceOf(address _owner) override public view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) override public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) override public view returns (uint256 remaining) {
      return allowed[_owner][_spender];
    }

    fallback() external {
        revert();
    }
}


library SafeMath {
    function mul(uint256 _a, uint256 _b) internal pure returns (uint256) {
        if (_a == 0) {
            return 0;
        }
        uint256 c = _a * _b;
        require(c / _a == _b, "safeMath mul failed");
        return c;
    }
    function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
        uint256 c = _a / _b;
        // require(b > 0); // Solidity automatically throws when dividing by 0
        // require(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }
    function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
        require(_b <= _a, "safeMath sub failed");
        return _a - _b;
    }
    function add(uint256 _a, uint256 _b) internal pure returns (uint256) {
        uint256 c = _a + _b;
        require(c >= _a, "safeMath add failed");
        return c;
    }
}

//--------------------==
library AddressUtils {
    function isContract(address _addr) internal view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(_addr) }
        // solium-disable-line security/no-inline-assembly
        return size > 0;
    }

    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}

/**
 * MIT License
 * ===========
 *
 * Copyright (c) 2020 Aries Financial
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */