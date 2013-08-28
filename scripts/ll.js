function LinkedListNode()
{
	this.data = null;
	this.next = null;
}

function LinkedList()
{
	this.head = null;
	this.tail = null;
	this.size = 0;
}

LinkedList.prototype.Add = function(data)
{
	var newNode = new LinkedListNode();
	newNode.data = data;

	// if there are no other nodes in the list...
	// newNode is the only item, and therefore the head and tail
	if (this.head == null)
	{
		this.head = newNode;
		this.tail = newNode;
	}
	else
	{
		this.tail.next = newNode;
		this.tail = newNode;
	}

	this.size++;
}

// pushes a new node onto the head of the linkedlist
LinkedList.prototype.Push = function(data)
{
	var newHead = new LinkedListNode();
	newHead.data = data;
	var oldHead = this.head;
	this.head = newHead;
	newHead.next = oldHead;
	this.size++;
}

// step through each node in the list to find
// the one to remove
LinkedList.prototype.Remove = function(data)
{
	var current = this.head;

	// no nodes?
	if (this.size == 0)
	{
		return;
	}

	var removed = false;

	// is it the 1st node?
	if (data == current.data)
	{
		if (current.next == null)
		{
			this.head.data = null;
			this.head = null;
			this.tail = null;
			this.size--;
			return;
		}

		current.data = null;
		current = current.next;
		this.head = current;
		this.size--;
		return;
	}

	while (true)
	{
		// end of list?
		if (current == null)
		{
			removed = false;
			break;
		}

		// check next node
		var next = current.next;

		if (next != null)
		{
			if (data == next.data)
			{
				// get its next node
				var nextNode = next.next;
				// and connect it
				current.next = nextNode;
				// is it the tail?
				if (next == this.tail)
				{
					// the previous node is now the tail of the list
					this.tail = current;
					current.next = null;
				}
				next = null;
				removed = true;
				break;
			}
		}

		current = current.next;
	}

	if (removed)
	{
		this.size--;
	}
}